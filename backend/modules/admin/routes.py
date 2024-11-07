import re

from flask import session, request, redirect, url_for
from flask_login import current_user
from flask_security import hash_password
from sqlalchemy.sql.functions import current_timestamp
from backend.app import app, db
from backend.modules.admin.users import user_datastore

@app.route("/admin/confirm_user", methods=["POST"])
def confirm_user():
    if 'change_password_error' in session:
        session.pop('change_password_error')
    new_password = request.form['new_password']
    new_password_confirm = request.form['new_password_confirm']

    # validate password and confirmation password match
    if new_password != new_password_confirm:
        session['change_password_error'] = "Passwords do not match"
        return redirect(url_for("security.change_password"))

    # validate password
    if len(new_password) < 8:
        session['change_password_error'] = "Make sure your password has at least 8 characters"
        return redirect(url_for("security.change_password"))
    elif re.search('[0-9]', new_password) is None:
        session['change_password_error'] = "Make sure your password has a number in it"
        return redirect(url_for("security.change_password"))
    elif re.search('[A-Z]', new_password) is None:
        session['change_password_error'] = "Make sure your password has a capital letter in it"
        return redirect(url_for("security.change_password"))
    elif re.search('[$#@!*.]', new_password) is None:
        session['change_password_error'] = "Make sure your password has at least 1 special character ($, #, @, !, *, .) in it"
        return redirect(url_for("security.change_password"))

    current_user.confirmed_at = current_timestamp()
    current_user.password = hash_password(new_password)
    user_datastore.put(current_user)
    db.session.commit()
    return redirect("/admin")