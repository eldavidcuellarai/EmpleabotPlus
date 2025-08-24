from flask import Blueprint, render_template

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    # Render a very small index page so root doesn't 404 in deployments
    return render_template('index.html')
