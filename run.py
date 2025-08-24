#!/usr/bin/env python3
"""
Entry point for EmpleabotPlus application.
This file imports and runs the Flask app from the app module.
"""

from app import create_app
import os

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)