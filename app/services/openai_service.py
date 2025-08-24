import os
from flask import current_app, session
from openai import AzureOpenAI
import json

def get_openai_client():
    config = current_app.config
    if config.get('AZURE_OPENAI_KEY') and config.get('AZURE_OPENAI_ENDPOINT') and config.get('AZURE_OPENAI_ASSISTANT_ID'):
        return AzureOpenAI(
            api_key=config['AZURE_OPENAI_KEY'],
            azure_endpoint=config['AZURE_OPENAI_ENDPOINT'],
            api_version=config.get('AZURE_OPENAI_API_VERSION', '2024-02-15-preview')
        )
    return None

def get_or_create_thread():
    thread_id = session.get('thread_id')
    client = get_openai_client()
    if not thread_id and client:
        thread = client.beta.threads.create()
        session['thread_id'] = thread.id
        return thread.id
    return thread_id

def process_user_message(user_message, session):
    config = current_app.config
    client = get_openai_client()
    if not client:
        # Simulated response for local dev
        sample_html = ("<!doctype html><html><head><meta charset='utf-8'><title>CV</title>"
            "<style>body{font-family:Arial;margin:24px;}h1{color:#21825C;margin:0;}"
            "h2{margin:8px 0 0;} .section{margin-top:14px;} .item{margin:6px 0;}"
            "</head><body>"
            f"<h1>Nombre Apellido</h1><p>Resumen profesional breve.</p>"
            "<div class='section'><h2>Experiencia</h2><div class='item'><strong>Rol</strong> — Empresa (2022-2024)</div></div>"
            "<div class='section'><h2>Educación</h2><div class='item'>Licenciatura — Universidad</div></div>"
            "<div class='section'><h2>Habilidades</h2><div class='item'>Python, Excel, Comunicación</div></div>"
            "</body></html>")
        artifacts_block = (
            "---ARTIFACTS-START---\n" + json.dumps({
                "artifacts": [
                    {"id": "cv-general", "type": "html", "title": "CV optimizado (General)", "content": sample_html}
                ]
            }) + "\n---ARTIFACTS-END---")
        simulated = (
            "Gracias por tu mensaje. Estoy en modo de desarrollo local.\n\n"
            "Debajo encontrarás un artifact con un CV de ejemplo.\n\n"
            + artifacts_block +
            "\n\n---\n**Sugerencias:**\n"
            "- [¿Cómo mejorar mi CV?](acción:mejorar-cv)\n"
            "- [¿Consejos para entrevistas?](acción:entrevistas)\n"
            "- [¿Cursos recomendados?](acción:cursos)\n"
        )
        return simulated
    # Azure OpenAI logic
    thread_id = get_or_create_thread()
    client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=user_message
    )
    run = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=config['AZURE_OPENAI_ASSISTANT_ID']
    )
    run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
    while run.status in ["queued", "in_progress"]:
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
    messages = client.beta.threads.messages.list(thread_id=thread_id)
    if not messages.data:
        raise Exception('No response received')
    latest_message = messages.data[0]
    response_text = latest_message.content[0].text.value if latest_message.content else ""
    if not response_text:
        raise Exception('Empty response received')
    return response_text
