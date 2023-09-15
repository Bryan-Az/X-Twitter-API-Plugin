FROM python:3.8-slim-buster
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
WORKDIR /x-app
ENV FLASK_APP x-twitter-python-flask-app.py
RUN ls -al /x-app
CMD [ "python3", "-u", "-m" , "flask", "run", "--host=0.0.0.0"]
