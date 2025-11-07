from flask import Flask, render_template
from controllers import user_controller

app = Flask(__name__)

@app.route("/")
def hello():
    page = 'home.html'
    return render_template('index.html', page=page)

@app.route("/login")
def login():
    page = 'login.html'
    return render_template('index.html', page=page)

@app.route("/register")
def register():
    page = 'registration.html'
    return render_template('index.html', page=page)

@app.route("/quizes")
def quizes():
    page = 'quizes.html'
    return render_template('index.html', page=page)

# ============================= API ==========================================
 
@app.route("/api/login")
def loginProcess(methods = ["POST"]):
    return user_controller.loginProcess()


if __name__ == '__main__':
    app.run()