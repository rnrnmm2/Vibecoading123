#!/usr/bin/env python3
"""정적 파일 + 대구음식 API 프록시 서버.

사용법:
  python server.py
  브라우저에서 http://127.0.0.1:8080/daegu-food.html 열기
"""

from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = 8080
API_BASE = "https://www.daegufood.go.kr/kor/api/tasty.html"


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        # YouTube embed 오류 153 방지
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Accept")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path in ("/api/tasty", "/api/tasty/"):
            self.handle_tasty_proxy(parsed)
            return
        super().do_GET()

    def handle_tasty_proxy(self, parsed):
        query = urllib.parse.parse_qs(parsed.query)
        addr = (query.get("addr") or [""])[0].strip()
        if not addr:
            self.send_json({"error": "addr 파라미터가 필요합니다."}, status=400)
            return

        api_url = f"{API_BASE}?mode=json&addr={urllib.parse.quote(addr)}"
        req = urllib.request.Request(
            api_url,
            headers={
                "User-Agent": "Mozilla/5.0 (compatible; VIBE-Portfolio/1.0)",
                "Accept": "application/json,text/plain,*/*",
            },
        )

        try:
            with urllib.request.urlopen(req, timeout=30) as res:
                body = res.read()
                content_type = res.headers.get("Content-Type", "application/json; charset=utf-8")
        except urllib.error.HTTPError as err:
            detail = err.read().decode("utf-8", errors="replace")[:300]
            self.send_json(
                {"error": f"업스트림 API 오류 ({err.code})", "detail": detail},
                status=502,
            )
            return
        except Exception as err:  # noqa: BLE001
            self.send_json({"error": f"API 요청 실패: {err}"}, status=502)
            return

        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

        # 로컬 캐시 갱신 (다음 오프라인/폴백용)
        try:
            cache_dir = ROOT / "data" / "daegu"
            cache_dir.mkdir(parents=True, exist_ok=True)
            cache_path = cache_dir / f"{addr}.json"
            cache_path.write_bytes(body)
        except OSError:
            pass

    def send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        print(f"[{self.log_date_time_string()}] {self.address_string()} {fmt % args}")


def main():
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Serving {ROOT}")
    print(f"Open http://{HOST}:{PORT}/daegu-food.html")
    print("Proxy: /api/tasty?addr=중구")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
