# Set base image (host OS)
FROM python:3.9-alpine

RUN mkdir -p /usr/src/app
WORKDIR usr/src/app

# Copy the dependencies file to the working directory
COPY requirements.txt /usr/src/app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# ENV FLASK_ENV=production
# ENV FLASK_APP=app.py
# ENV MUSIXMATCH_KEY=43a20a41274881984e9e5c68bca9b428
# ENV OPENAI_KEY=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
# ENV SPOTIFY_CLIENT_ID=425323e46f604cdf8e9dc7fab647b3fb
# ENV SPOTIFY_CLIENT_SECRET=837fc99441ed41c7a2e81ea88d31fb15

EXPOSE 5000

CMD gunicorn -b :5000 app:app