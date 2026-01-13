     const { createApp } = Vue;

        createApp({
            data() {
                return {
                    isLoaded: false,
                    currentTime: '',
                    showModal: false,
                    isSubmitting: false,
                    showDoctorSuggestions: false,
                    appointmentId: '',
                    doctors: [
                        { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Retina Specialist' },
                        { id: 2, name: 'Dr. Michael Chen', specialization: 'Cornea Specialist' },
                        { id: 3, name: 'Dr. Emily Rodriguez', specialization: 'Pediatric Ophthalmology' },
                        { id: 4, name: 'Dr. Robert Williams', specialization: 'Glaucoma Specialist' },
                        { id: 5, name: 'Dr. Lisa Thompson', specialization: 'Cataract Surgery' }
                    ],
                    filteredDoctors: [],
                    errors: {},
                    form: {
                        // Patient Info
                        patientType: '',
                        patientId: '',
                        opdPaper: null,

                        // Personal Info
                        firstName: '',
                        lastName: '',
                        dob: '',
                        gender: '',
                        hasSocialSecurity: false,
                        socialSecurity: '',
                        mobile: '',
                        email: '',
                        city: '',
                        address: '',
                        zipCode: '',

                        // Medical Info
                        eyeCondition: '',
                        symptoms: [],
                        otherSymptom: '',
                        symptomDuration: '',
                        painLevel: 5,
                        eyeColor: '#8b4513',
                        medicalImage: null,

                        // Appointment
                        doctorSearch: '',
                        doctor: '',
                        appointmentDateTime: '',

                        // Payment
                        cardType: '',
                        cardNumber: '',
                        cvv: '',
                        paymentUrl: '',

                        // Terms & Options
                        acceptTerms: false,
                        smsReminder: false,
                        newsletter: false
                    }
                };
            },
            computed: {
                formattedJSON() {
                    const dataToExport = {
                        appointmentId: this.appointmentId,
                        patientType: this.form.patientType,
                        patientId: this.form.patientId,
                        patientName: `${this.form.firstName} ${this.form.lastName}`,
                        dob: this.form.dob,
                        gender: this.form.gender,
                        hasSocialSecurity: this.form.hasSocialSecurity,
                        socialSecurity: this.form.socialSecurity,
                        mobile: this.form.mobile,
                        email: this.form.email,
                        city: this.form.city,
                        address: this.form.address,
                        zipCode: this.form.zipCode,
                        eyeCondition: this.form.eyeCondition,
                        symptoms: this.form.symptoms,
                        otherSymptom: this.form.otherSymptom,
                        symptomDuration: this.form.symptomDuration,
                        painLevel: this.form.painLevel,
                        eyeColor: this.form.eyeColor,
                        doctor: this.form.doctor,
                        appointmentDateTime: this.form.appointmentDateTime,
                        appointmentDate: this.formatDateTime(this.form.appointmentDateTime),
                        cardType: this.form.cardType,
                        cardNumber: this.form.cardNumber ? 'XXXX-XXXX-XXXX-' + (this.form.cardNumber.slice(-4) || '') : '',
                        paymentUrl: this.form.paymentUrl,
                        acceptTerms: this.form.acceptTerms,
                        smsReminder: this.form.smsReminder,
                        newsletter: this.form.newsletter,
                        hasOpdPaper: !!this.form.opdPaper,
                        hasMedicalImage: !!this.form.medicalImage,
                        timestamp: new Date().toISOString(),
                        totalAmount: "$150.00"
                    };
                    return JSON.stringify(dataToExport, null, 2);
                },
                formattedJSONHtml() {
                    const jsonString = this.formattedJSON;
                    // Simple syntax highlighting for JSON
                    return jsonString
                        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                            let cls = 'json-number';
                            if (/^"/.test(match)) {
                                if (/:$/.test(match)) {
                                    cls = 'json-key';
                                } else {
                                    cls = 'json-string';
                                }
                            } else if (/true|false/.test(match)) {
                                cls = 'json-boolean';
                            } else if (/null/.test(match)) {
                                cls = 'json-null';
                            }
                            return '<span class="' + cls + '">' + match + '</span>';
                        });
                },
                minDateTime() {
                    const now = new Date();
                    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                    return now.toISOString().slice(0, 16);
                }
            },
            mounted() {
                this.isLoaded = true;
                this.showModal = false;  // Ensure modal is closed on page load
                // Initialize current time immediately
                const now = new Date();
                this.currentTime = now.toLocaleTimeString('en-US', {
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                // Real-time clock
                setInterval(() => {
                    const now = new Date();
                    this.currentTime = now.toLocaleTimeString('en-US', {
                        hour12: true,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                }, 1000);
            },
            methods: {
                // Patient Type Handling
                handlePatientTypeChange() {
                    this.errors.patientType = '';

                    if (this.form.patientType === 'new') {
                        const timestamp = Date.now().toString().slice(-6);
                        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                        this.form.patientId = `PAT-${timestamp}-${random}`;
                        this.form.opdPaper = null;
                    } else if (this.form.patientType === 'old') {
                        this.form.patientId = '';
                    }
                    this.validateField('patientType');
                },

                // Fill Dummy Data for Testing
                fillDummyData() {
                    this.form = {
                        patientType: 'new',
                        patientId: `PAT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                        opdPaper: null,
                        firstName: 'John',
                        lastName: 'Doe',
                        dob: '1990-05-15',
                        gender: 'male',
                        hasSocialSecurity: false,
                        socialSecurity: '',
                        mobile: '9841234567',
                        email: 'john.doe@example.com',
                        city: 'Kathmandu',
                        address: '123 Main Street, Apartment 4B',
                        zipCode: '44600',
                        eyeCondition: 'myopia',
                        symptoms: ['blurred', 'headache'],
                        otherSymptom: '',
                        symptomDuration: '1-2 weeks',
                        painLevel: 5,
                        eyeColor: '#8b4513',
                        medicalImage: null,
                        doctorSearch: '',
                        doctor: 'Dr. Sarah Johnson',
                        appointmentDateTime: this.getNextWeekDateTime(),
                        cardType: 'visa',
                        cardNumber: '4532123456789010',
                        cvv: '123',
                        paymentUrl: '',
                        acceptTerms: true,
                        smsReminder: true,
                        newsletter: true
                    };

                    // Clear errors
                    this.errors = {};
                    alert('Dummy data filled successfully! Click Submit to test the form.');
                },

                // Helper to get next week's date
                getNextWeekDateTime() {
                    const date = new Date();
                    date.setDate(date.getDate() + 7);
                    date.setHours(10, 0, 0, 0);
                    return date.toISOString().slice(0, 16);
                },

                // Field Validation - FIXED: Now properly shows errors
                validateField(field) {
                    const value = this.form[field];

                    switch (field) {
                        case 'patientType':
                            this.errors.patientType = !value ? 'Please select patient type' : '';
                            break;
                        case 'patientId':
                            if (this.form.patientType === 'old') {
                                this.errors.patientId = !value ? 'Please enter patient ID' :
                                    !/^PAT-\d{6}-\d{3}$/.test(value) ? 'Invalid patient ID format (PAT-123456-789)' : '';
                            } else {
                                this.errors.patientId = '';
                            }
                            break;
                        case 'firstName':
                            this.errors.firstName = !value ? 'First name is required' :
                                value.length > 20 ? 'Maximum 20 characters allowed' : '';
                            break;
                        case 'lastName':
                            this.errors.lastName = !value ? 'Last name is required' :
                                value.length > 20 ? 'Maximum 20 characters allowed' : '';
                            break;
                        case 'dob':
                            if (!value) {
                                this.errors.dob = 'Date of birth is required';
                            } else {
                                const dob = new Date(value);
                                const today = new Date();
                                const age = today.getFullYear() - dob.getFullYear();
                                if (age < 0 || age > 120) {
                                    this.errors.dob = 'Invalid date of birth';
                                } else if (age < 18) {
                                    this.errors.dob = 'Must be 18 years or older';
                                } else {
                                    this.errors.dob = '';
                                }
                            }
                            break;
                        case 'gender':
                            this.errors.gender = !value ? 'Please select gender' : '';
                            break;
                        case 'socialSecurity':
                            if (this.form.hasSocialSecurity) {
                                this.errors.socialSecurity = !value ? 'Social Security Number is required' :
                                    !/^\d{3}-\d{2}-\d{4}$/.test(value) ? 'Invalid SSN format (XXX-XX-XXXX)' : '';
                            } else {
                                this.errors.socialSecurity = '';
                            }
                            break;
                        case 'mobile':
                            if (!value) {
                                this.errors.mobile = 'Mobile number is required';
                            } else {
                                this.errors.mobile = value.length !== 10 ? 'Must be exactly 10 digits' : '';
                            }
                            break;
                        case 'email':
                            if (!value) {
                                this.errors.email = 'Email is required';
                            } else {
                                this.errors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format' : '';
                            }
                            break;
                        case 'city':
                            if (!value) {
                                this.errors.city = 'City is required';
                            } else {
                                const lettersOnly = /^[A-Za-z\s]+$/.test(value);
                                this.errors.city = !lettersOnly ? 'Only letters allowed' : '';
                            }
                            break;
                        case 'address':
                            if (!value) {
                                this.errors.address = 'Address is required';
                            } else {
                                this.errors.address = value.length > 200 ? 'Maximum 200 characters' : '';
                            }
                            break;
                        case 'zipCode':
                            if (!value) {
                                this.errors.zipCode = 'ZIP code is required';
                            } else {
                                const zipPattern = /^\d{5}(-\d{4})?$/;
                                this.errors.zipCode = !zipPattern.test(value) ? 'Invalid ZIP code format (12345 or 12345-6789)' : '';
                            }
                            break;
                        case 'symptoms':
                            this.errors.symptoms = this.form.symptoms.length === 0 ? 'Select at least one symptom' : '';
                            break;
                        case 'symptomDuration':
                            this.errors.symptomDuration = !value ? 'Please select symptom duration' : '';
                            break;
                        case 'doctor':
                            this.errors.doctor = !value ? 'Please select a doctor' : '';
                            break;
                        case 'appointmentDateTime':
                            if (!value) {
                                this.errors.appointmentDateTime = 'Appointment date and time is required';
                            } else {
                                const selected = new Date(value);
                                const now = new Date();
                                if (selected <= now) {
                                    this.errors.appointmentDateTime = 'Appointment must be in the future';
                                } else {
                                    this.errors.appointmentDateTime = '';
                                }
                            }
                            break;
                        case 'cardType':
                            this.errors.cardType = !value ? 'Please select payment method' : '';
                            break;
                        case 'cardNumber':
                            if (this.form.cardType === 'visa' || this.form.cardType === 'mastercard') {
                                if (!value) {
                                    this.errors.cardNumber = 'Card number is required';
                                } else {
                                    const cleaned = value.replace(/\D/g, '');
                                    this.errors.cardNumber = cleaned.length !== 16 ? 'Must be 16 digits' : '';
                                }
                            } else {
                                this.errors.cardNumber = '';
                            }
                            break;
                        case 'cvv':
                            if (this.form.cardType === 'visa' || this.form.cardType === 'mastercard') {
                                if (!value) {
                                    this.errors.cvv = 'CVV is required';
                                } else {
                                    this.errors.cvv = value.length !== 3 ? 'Must be 3 digits' : '';
                                }
                            } else {
                                this.errors.cvv = '';
                            }
                            break;
                        case 'paymentUrl':
                            if (this.form.cardType === 'online') {
                                this.errors.paymentUrl = !value ? 'Payment URL is required' :
                                    !/^https?:\/\/.+\..+/.test(value) ? 'Invalid URL format' : '';
                            } else {
                                this.errors.paymentUrl = '';
                            }
                            break;
                        case 'acceptTerms':
                            this.errors.acceptTerms = !value ? 'You must accept terms & conditions' : '';
                            break;
                    }
                },

                // Custom Validation Methods
                validateMobile() {
                    const value = this.form.mobile.replace(/\D/g, '');
                    this.form.mobile = value;
                    this.validateField('mobile');
                },

                validateCity() {
                    const value = this.form.city.replace(/[^A-Za-z\s]/g, '');
                    this.form.city = value;
                    this.validateField('city');
                },

                formatZipCode() {
                    let value = this.form.zipCode.replace(/[^\d-]/g, '');

                    if (value.length > 5 && !value.includes('-')) {
                        value = value.substring(0, 5) + '-' + value.substring(5, 9);
                    }

                    if (value.length > 10) {
                        value = value.substring(0, 10);
                    }

                    this.form.zipCode = value;
                    this.validateField('zipCode');
                },

                validateCVV() {
                    const value = this.form.cvv.replace(/\D/g, '').slice(0, 3);
                    this.form.cvv = value;
                    this.validateField('cvv');
                },

                // Formatting Functions
                formatSocialSecurity(event) {
                    let value = event.target.value.replace(/\D/g, '');
                    if (value.length > 3) {
                        value = value.substring(0, 3) + '-' + value.substring(3);
                    }
                    if (value.length > 6) {
                        value = value.substring(0, 6) + '-' + value.substring(6);
                    }
                    if (value.length > 11) {
                        value = value.substring(0, 11);
                    }
                    this.form.socialSecurity = value;
                    this.validateField('socialSecurity');
                },

                formatCardNumber(event) {
                    let value = event.target.value.replace(/\D/g, '');
                    if (value.length > 4) {
                        value = value.substring(0, 4) + '-' + value.substring(4);
                    }
                    if (value.length > 9) {
                        value = value.substring(0, 9) + '-' + value.substring(9);
                    }
                    if (value.length > 14) {
                        value = value.substring(0, 14) + '-' + value.substring(14);
                    }
                    if (value.length > 19) {
                        value = value.substring(0, 19);
                    }
                    this.form.cardNumber = value;
                },

                toggleSocialSecurity() {
                    if (!this.form.hasSocialSecurity) {
                        this.form.socialSecurity = '';
                        this.errors.socialSecurity = '';
                    } else {
                        this.validateField('socialSecurity');
                    }
                },

                // File Upload
                handleFileUpload(event, field) {
                    const file = event.target.files[0];
                    if (file) {
                        if (field === 'opdPaper' && !file.name.toLowerCase().endsWith('.pdf')) {
                            alert('Please upload a PDF file');
                            event.target.value = '';
                            return;
                        }
                        this.form[field] = file;
                    }
                },

                // Doctor Search
                searchDoctors() {
                    if (this.form.doctorSearch) {
                        this.filteredDoctors = this.doctors.filter(doctor =>
                            doctor.name.toLowerCase().includes(this.form.doctorSearch.toLowerCase()) ||
                            doctor.specialization.toLowerCase().includes(this.form.doctorSearch.toLowerCase())
                        );
                    } else {
                        this.filteredDoctors = [...this.doctors];
                    }
                },

                hideDoctorSuggestions() {
                    setTimeout(() => {
                        this.showDoctorSuggestions = false;
                    }, 200);
                },

                selectDoctor(doctor) {
                    this.form.doctor = doctor.name;
                    this.form.doctorSearch = doctor.name;
                    this.showDoctorSuggestions = false;
                    this.validateField('doctor');
                },

                // Symptoms
                toggleSymptom(symptom) {
                    const index = this.form.symptoms.indexOf(symptom);
                    if (index === -1) {
                        this.form.symptoms.push(symptom);
                    } else {
                        this.form.symptoms.splice(index, 1);
                        if (symptom === 'other') {
                            this.form.otherSymptom = '';
                        }
                    }
                    this.validateField('symptoms');
                },

                getSymptomsDisplay() {
                    const symptomMap = {
                        'blurred': 'Blurred Vision',
                        'pain': 'Eye Pain',
                        'headache': 'Headaches',
                        'other': this.form.otherSymptom || 'Other'
                    };

                    const symptoms = this.form.symptoms.map(symptom => symptomMap[symptom]).filter(Boolean);
                    return symptoms.length > 0 ? symptoms.join(', ') : 'None';
                },

                getCardTypeDisplay(cardType) {
                    switch (cardType) {
                        case 'visa': return 'Visa';
                        case 'mastercard': return 'MasterCard';
                        case 'online': return 'Online Payment';
                        default: return 'Not Selected';
                    }
                },

                // Form Submission - Shows modal on success
                async submitForm() {
                    const requiredFields = [
                        'patientType', 'patientId', 'firstName', 'lastName', 'dob', 'gender',
                        'mobile', 'email', 'city', 'address', 'zipCode', 'symptoms',
                        'symptomDuration', 'doctor', 'appointmentDateTime', 'cardType',
                        'acceptTerms'
                    ];

                    if (this.form.hasSocialSecurity) {
                        requiredFields.push('socialSecurity');
                    }

                    if (this.form.cardType === 'visa' || this.form.cardType === 'mastercard') {
                        requiredFields.push('cardNumber', 'cvv');
                    }

                    if (this.form.cardType === 'online') {
                        requiredFields.push('paymentUrl');
                    }

                    requiredFields.forEach(field => this.validateField(field));

                    const hasErrors = Object.values(this.errors).some(error => error !== '' && error !== undefined);

                    if (hasErrors) {
                        alert('Please fix all validation errors before submitting.');
                        // Scroll to first error
                        const firstErrorField = Object.keys(this.errors).find(field => this.errors[field]);
                        if (firstErrorField) {
                            const element = document.querySelector(`[v-model="form.${firstErrorField}"]`);
                            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        return;
                    }

                    const timestamp = Date.now().toString().slice(-8);
                    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                    this.appointmentId = `APT-${timestamp}-${random}`;

                    this.isSubmitting = true;

                    setTimeout(() => {
                        this.showModal = true; // Show modal on success
                        this.isSubmitting = false;
                    }, 1500);
                },

                // Close Modal
                closeModal() {
                    this.showModal = false;
                },

                // Reset Form
                resetForm() {
                    if (confirm('Are you sure you want to reset all form data?')) {
                        this.form = {
                            patientType: '',
                            patientId: '',
                            opdPaper: null,
                            firstName: '',
                            lastName: '',
                            dob: '',
                            gender: '',
                            hasSocialSecurity: false,
                            socialSecurity: '',
                            mobile: '',
                            email: '',
                            city: '',
                            address: '',
                            zipCode: '',
                            eyeCondition: '',
                            symptoms: [],
                            otherSymptom: '',
                            symptomDuration: '',
                            painLevel: 5,
                            eyeColor: '#8b4513',
                            medicalImage: null,
                            doctorSearch: '',
                            doctor: '',
                            appointmentDateTime: '',
                            cardType: '',
                            cardNumber: '',
                            cvv: '',
                            paymentUrl: '',
                            acceptTerms: false,
                            smsReminder: false,
                            newsletter: false
                        };
                        this.errors = {};
                        this.showModal = false;
                        this.appointmentId = '';
                        alert('Form has been reset.');
                    }
                },

                // Format DateTime for display
                formatDateTime(datetime) {
                    if (!datetime) return 'N/A';
                    const date = new Date(datetime);
                    return date.toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                },

                // Save Data as JSON file
                saveData() {
                    try {
                        const blob = new Blob([this.formattedJSON], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `appointment_${this.appointmentId}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        alert(`Appointment data saved as appointment_${this.appointmentId}.json`);
                    } catch (error) {
                        alert('Error saving file. Please try again.');
                        console.error('Error saving file:', error);
                    }
                },

                // Print Data
                printData() {
                    const printContent = `
                        <html>
                            <head>
                                <title>Appointment Confirmation - ${this.appointmentId}</title>
                                <style>
                                    body { font-family: Arial, sans-serif; padding: 20px; }
                                    h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
                                    .appointment-details { margin: 20px 0; }
                                    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
                                    .detail-label { font-weight: bold; color: #64748b; }
                                    .detail-value { font-weight: 600; }
                                    pre { background: #f8fafc; padding: 15px; border-radius: 5px; border: 1px solid #e2e8f0; overflow-x: auto; }
                                    @media print {
                                        body { padding: 0; }
                                        button { display: none; }
                                    }
                                </style>
                            </head>
                            <body>
                                <h1>EyeCare Pro Hospital - Appointment Confirmation</h1>
                                <p><strong>Appointment ID:</strong> ${this.appointmentId}</p>
                                <p><strong>Date Printed:</strong> ${new Date().toLocaleString()}</p>
                                
                                <div class="appointment-details">
                                    <div class="detail-row">
                                        <span class="detail-label">Patient Name:</span>
                                        <span class="detail-value">${this.form.firstName} ${this.form.lastName}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Patient ID:</span>
                                        <span class="detail-value">${this.form.patientId}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Doctor:</span>
                                        <span class="detail-value">${this.form.doctor}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Appointment Date & Time:</span>
                                        <span class="detail-value">${this.formatDateTime(this.form.appointmentDateTime)}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Symptoms:</span>
                                        <span class="detail-value">${this.getSymptomsDisplay()}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Payment Method:</span>
                                        <span class="detail-value">${this.getCardTypeDisplay(this.form.cardType)}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Total Amount:</span>
                                        <span class="detail-value">$150.00</span>
                                    </div>
                                </div>
                                
                                <h3>Complete Appointment Data (JSON):</h3>
                                <pre>${this.formattedJSON}</pre>
                                
                                <p style="margin-top: 30px; font-size: 0.9em; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                                    <strong>Note:</strong> This is a computer-generated appointment confirmation. Please bring this confirmation with you to your appointment.
                                </p>
                            </body>
                        </html>
                    `;

                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                        printWindow.document.write(printContent);
                        printWindow.document.close();
                        printWindow.focus();
                        setTimeout(() => {
                            printWindow.print();
                        }, 500);
                    } else {
                        alert('Please allow pop-ups to print the confirmation.');
                    }
                }
            }
        }).mount('#app');
