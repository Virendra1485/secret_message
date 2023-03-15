To run backend server please create virtual environment in secret_message_assignment directory with command

```
virtualenv venv
```

then run

```
source venv/bin/activate
```

to activate the environment 



then move to backend directory and run command 
```
pip install -r requirements.txt
```

to install the requirements for backend

Now create a file with name '.env' for environment variable

```
DB_NAME=***

DB_USER=***

DB_PASSWORD=***

DB_HOST=***

DB_PORT=***
```

Now run command 

```
python manage.py migrate
```

to apply migration on database

Now you can run the server with command 

```
python manage.py runserver

```
