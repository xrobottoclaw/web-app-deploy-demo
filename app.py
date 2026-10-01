from flask import Flask, render_template, request, flash, redirect, url_for

app = Flask(__name__)
app.secret_key = 'dev-secret-key-change-in-production'


@app.route('/')
def index():
    """Landing page route."""
    return render_template('index.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Contact form page with POST handler."""
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()

        # Server-side validation
        errors = {}
        if not name:
            errors['name'] = 'Name is required'
        if not email:
            errors['email'] = 'Email is required'
        elif '@' not in email:
            errors['email'] = 'Invalid email format'
        if not subject:
            errors['subject'] = 'Subject is required'
        if not message:
            errors['message'] = 'Message is required'

        if errors:
            for field, error in errors.items():
                flash(f'{field.capitalize()}: {error}', 'error')
            return render_template('contact.html', form_data=request.form), 400

        # In a real app, you would send an email or save to database here
        flash('Thank you for your message! We will get back to you soon.', 'success')
        return redirect(url_for('contact'))

    return render_template('contact.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)