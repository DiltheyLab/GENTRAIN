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
    if new_password != new_password_confirm:
        session['change_password_error'] = "Passwords do not match"
        return redirect(url_for("security.change_password"))
    current_user.confirmed_at = current_timestamp()
    current_user.password = hash_password(new_password)
    user_datastore.put(current_user)
    db.session.commit()
    return redirect("/admin")