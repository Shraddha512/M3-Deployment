from flask import Flask, render_template, json, request, g
import sqlite3 as sql
import redis

'''
test
'''

app = Flask(__name__)
DATABASE = 'user_db.db'
HOST = "0.0.0.0"
PORT = 5000

r= redis.StrictRedis()

@app.route('/')
def main():
    if(r.get("flag")=="0"):	
    	return render_template('index.html')
    else:
	return render_template('indexcolor.html')


@app.route('/showSignUp')
def showSignUp():
    return render_template('signup.html')


@app.route('/signUp', methods=['POST', 'GET'])
def signUp():
    try:
        _name = request.form['inputName']
        _email = request.form['inputEmail']
        _password = request.form['inputPassword']

        # validate the received values
        if _name and _email and _password:
            con = sql.connect("user_db.db")
            cur = con.cursor()
            cur.execute("INSERT INTO users (name,email, password) VALUES (?,?,?)", (_name,_email,_password))
            con.commit()
            con.close()
            return render_template('signin.html')

    except Exception as e:
        return json.dumps({'error': str(e)})
    finally:
        print("In finally")


@app.route('/signin', methods=['POST', 'GET'])
def signin():
    try:
        if request.method == 'GET':
            return render_template('signin.html')
        elif request.method == 'POST':

            _email = request.form['inputEmail']
            _password = request.form['inputPassword']

            if _email and _password:
                con = sql.connect("user_db.db")
                cur = con.cursor()
                #cur.execute('SELECT SQLITE_VERSION()')
                cur.execute("SELECT * FROM users WHERE email=? AND password=?", (_email,_password))
                data = cur.fetchone()
                if data:
                    return render_template('welcome.html',username = _email)
                else:
                    return render_template('error.html')

    except:
        print("error")
    finally:
        print("signin Finally")


def main():
    app.run(host=HOST, port=PORT,debug=False)

if __name__ == '__main__':
    main()
