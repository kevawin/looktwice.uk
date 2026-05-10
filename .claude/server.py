import http.server

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    def log_message(self, fmt, *args):
        pass

if __name__ == '__main__':
    http.server.HTTPServer(('', 4173), NoCacheHandler).serve_forever()
