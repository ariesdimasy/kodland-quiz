$(document).ready(function() {
    // Initialize DataTable
    let usersTable = $('#usersTable').DataTable({
        responsive: true,
        pageLength: 10,
        order: [[0, 'desc']],
        columnDefs: [
            {
                targets: -1,
                orderable: false,
                searchable: false
            }
        ],
        language: {
            search: "Search users:",
            lengthMenu: "Show _MENU_ users per page",
            info: "Showing _START_ to _END_ of _TOTAL_ users",
            paginate: {
                first: "First",
                last: "Last",
                next: "Next",
                previous: "Previous"
            }
        }
    });

    // Load existing users from localStorage
    loadUsersFromStorage();

    // Password toggle functionality
    $('#togglePassword').click(function() {
        const passwordInput = $('#password');
        const icon = $(this).find('i');
        
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordInput.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // Form submission with AJAX
    $('#registrationForm').on('submit', function(e) {
        e.preventDefault();
        
        // Clear previous error messages
        clearErrors();
        
        // Get form data
        const formData = {
            name: $('#name').val().trim(),
            email: $('#email').val().trim(),
            password: $('#password').val()
        };

        // Validate form data
        if (!validateForm(formData)) {
            return;
        }

        // Simulate AJAX request
        simulateAjaxRegistration(formData);
    });

    // Form validation
    function validateForm(data) {
        let isValid = true;

        // Name validation
        if (!data.name) {
            showError('nameError', 'Name is required');
            isValid = false;
        } else if (data.name.length < 2) {
            showError('nameError', 'Name must be at least 2 characters long');
            isValid = false;
        }

        // Check if email already exists
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const emailExists = existingUsers.some(user => user.email === data.email);
        if (emailExists) {
            showError('emailError', 'This email is already registered');
            isValid = false;
        }

        // Password validation
        if (!data.password) {
            showError('passwordError', 'Password is required');
            isValid = false;
        } else if (data.password.length < 6) {
            showError('passwordError', 'Password must be at least 6 characters long');
            isValid = false;
        }

        if(!data.password_confirmation){
            showError('passwordError', 'Password Confirmation is required');
            isValid = false;
        }

        if(data.password !== data.password_confirmation){
            showError('passwordError', 'Password Confirmation not match');
            isValid = false;
        }


        return isValid;
    }

    // Show error message
    function showError(elementId, message) {
        $(`#${elementId}`).text(message);
    }

    // Clear all error messages
    function clearErrors() {
        $('.error-message').text('');
    }

    // Simulate AJAX registration
    function simulateAjaxRegistration(userData) {
        // Show loading state
        const submitBtn = $('.submit-btn');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Registering...');
        submitBtn.prop('disabled', true);

        // Simulate server delay
        setTimeout(function() {
            // Create user object
            const user = {
                id: Date.now(),
                name: userData.name,
                email: userData.email,
                password: userData.password, // In real app, this should be hashed
                registrationDate: new Date().toISOString()
            };

            // Save to localStorage
            saveUserToStorage(user);

            // Update DataTable
            addUserToTable(user);

            // Show success message
            showSuccessMessage();

            // Reset form
            $('#registrationForm')[0].reset();

            // Reset button
            submitBtn.html(originalText);
            submitBtn.prop('disabled', false);

        }, 1000); // 1 second delay to simulate AJAX
    }

    // Save user to localStorage
    function saveUserToStorage(user) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Load users from localStorage
    function loadUsersFromStorage() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.forEach(user => {
            addUserToTable(user);
        });
    }

    // Add user to DataTable
    function addUserToTable(user) {
        const registrationDate = new Date(user.registrationDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });


        usersTable.row.add([
            user.id,
            user.name,
            user.email,
            registrationDate
        ]).draw();
    }

    // Show success message
    function showSuccessMessage() {
        const successMessage = $('#successMessage');
        successMessage.fadeIn();
        
        setTimeout(function() {
            successMessage.fadeOut();
        }, 3000);
    }

    // Real-time validation
    $('#name').on('input', function() {
        const name = $(this).val().trim();
        if (name && name.length < 2) {
            showError('nameError', 'Name must be at least 2 characters long');
        } else {
            $('#nameError').text('');
        }
    });

    $('#email').on('input', function() {
        const email = $(this).val().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            showError('emailError', 'Please enter a valid email address');
        } else {
            $('#emailError').text('');
        }
    });

    $('#password').on('input', function() {
        const password = $(this).val();
        if (password && password.length < 6) {
            showError('passwordError', 'Password must be at least 6 characters long');
        } else {
            $('#passwordError').text('');
        }
    });
});

// Handle form submission for both create and edit modes
$(document).on('submit', '#registrationForm', function(e) {
    e.preventDefault();

});
