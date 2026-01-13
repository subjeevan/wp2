const { createApp } = Vue;

createApp({
    data() {
        return {
            time: '',
            showModal: false,
            form: {
                name: '',
                dob: '',
                gender: '',
                phone: '',
                email: '',
                address: '',
                reason: '',
                eye: '',
                duration: '',
                history: '',
                plan: '',
                fee: 0,
                appointment: '',
                notes: '',
                username: '',
                password: ''
            }
        };
    },
    mounted() {
        setInterval(() => {
            this.time = new Date().toLocaleTimeString();
        }, 1000);
    },
    methods: {
        // Auto-generate credentials in real time
        generateCredentials() {
            if (this.form.name && this.form.dob) {
                const n = this.form.name.split(' ')[0].toLowerCase();
                const d = this.form.dob.replaceAll('-', '');
                this.form.username = n + d.slice(-4);
                this.form.password = n + '@' + d.slice(0, 4);
            }
        },
        // Set package & fee
        setPlan(plan, fee) {
            this.form.plan = plan;
            this.form.fee = fee;
        },
        openModal() {
            this.showModal = true;
        },
        confirmSave() {
            this.showModal = false;
            alert("Eye appointment booked successfully!");
        },
        clearForm() {
            location.reload();
        }
    }
}).mount('#app');