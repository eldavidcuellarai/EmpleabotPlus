#!/usr/bin/env python3
"""
Entry point for EmpleabotPlus application.
This file imports and runs the Flask app from the app module.
Optimized for RunPod deployment.
"""

from app import create_app
import os

# Expose the Flask app at module level so WSGI servers (gunicorn)
# can import it via `run:app`. This prevents import-time errors when the
# process manager expects an `app` symbol.
app = create_app()

if __name__ == '__main__':
    # RunPod typically uses port 8000, but allow override via environment
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('DEBUG', 'False').lower() in ('true', '1', 'yes')
    app.run(host='0.0.0.0', port=port, debug=debug)