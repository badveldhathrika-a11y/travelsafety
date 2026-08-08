// SmartEdu — Smart Education Platform
// Uses localStorage for data persistence

class SmartEduApp {
    constructor() {
        this.students = this.loadData('students') || [];
        this.records = this.loadData('records') || [];
        this.assignments = this.loadData('assignments') || [];
        this.grades = this.loadData('grades') || [];
        this.announcements = this.loadData('announcements') || [];

        this.init();
    }

    // Load data from localStorage
    loadData(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            return null;
        }
    }

    // Save data to localStorage
    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Initialize the app
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setDefaultDate();
        this.populateSelects();
        this.renderAll();
    }

    // Cache DOM elements
    cacheElements() {
        // Navigation
        this.navItems = document.querySelectorAll('.nav-item');
        this.tabContents = document.querySelectorAll('.tab-content');

        // Students
        this.form = document.getElementById('student-form');
        this.nameInput = document.getElementById('student-name');
        this.rollInput = document.getElementById('student-roll');
        this.classInput = document.getElementById('student-class');
        this.emailInput = document.getElementById('student-email');
        this.studentTableBody = document.getElementById('student-table-body');
        this.studentCount = document.getElementById('student-count');
        this.noStudents = document.getElementById('no-students');

        // Attendance
        this.attendanceDate = document.getElementById('attendance-date');
        this.attendanceTableBody = document.getElementById('attendance-table-body');
        this.noAttendance = document.getElementById('no-attendance');
        this.saveAttendanceBtn = document.getElementById('save-attendance');
        this.attendanceStatus = document.getElementById('attendance-status');

        // Assignments
        this.assignmentForm = document.getElementById('assignment-form');
        this.assignTitle = document.getElementById('assign-title');
        this.assignDesc = document.getElementById('assign-desc');
        this.assignDue = document.getElementById('assign-due');
        this.assignClass = document.getElementById('assign-class');
        this.assignmentTableBody = document.getElementById('assignment-table-body');
        this.assignmentCount = document.getElementById('assignment-count');
        this.noAssignments = document.getElementById('no-assignments');

        // Grades
        this.gradeForm = document.getElementById('grade-form');
        this.gradeStudent = document.getElementById('grade-student');
        this.gradeSubject = document.getElementById('grade-subject');
        this.gradeScore = document.getElementById('grade-score');
        this.gradesTableBody = document.getElementById('grades-table-body');
        this.noGrades = document.getElementById('no-grades');

        // Announcements
        this.announcementForm = document.getElementById('announcement-form');
        this.announceTitle = document.getElementById('announce-title');
        this.announceBody = document.getElementById('announce-body');
        this.announcementList = document.getElementById('announcement-list');
        this.noAnnouncementsFull = document.getElementById('no-announcements-full');

        // Dashboard
        this.statStudents = document.getElementById('stat-students');
        this.statAttendance = document.getElementById('stat-attendance');
        this.statAssignments = document.getElementById('stat-assignments');
        this.statAvgGrade = document.getElementById('stat-avg-grade');
        this.topPerformers = document.getElementById('top-performers');
        this.noPerformers = document.getElementById('no-performers');
        this.latestAnnouncements = document.getElementById('latest-announcements');
        this.noAnnouncements = document.getElementById('no-announcements');
    }

    // Bind events
    bindEvents() {
        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.switchTab(item.dataset.tab);
            });
        });

        // Student form
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addStudent();
        });

        // Save attendance
        this.saveAttendanceBtn.addEventListener('click', () => {
            this.saveAttendance();
        });

        // Assignment form
        this.assignmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAssignment();
        });

        // Grade form
        this.gradeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addGrade();
        });

        // Announcement form
        this.announcementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.postAnnouncement();
        });
    }

    // Set default date to today (YYYY-MM-DD)
    setDefaultDate() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        this.attendanceDate.value = `${yyyy}-${mm}-${dd}`;
        this.assignDue.value = `${yyyy}-${mm}-${dd}`;
    }

    // Switch active tab
    switchTab(tabName) {
        this.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabName);
        });
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabName);
        });
    }

    // Get unique classes for assignment dropdown
    getClasses() {
        const classes = new Set();
        this.students.forEach(s => {
            if (s.cls) classes.add(s.cls);
        });
        return [...classes];
    }

    // Populate select dropdowns (classes, students)
    populateSelects() {
        // Assignment class filter
        this.assignClass.innerHTML = '<option value="">All Classes</option>';
        this.getClasses().forEach(cls => {
            const option = document.createElement('option');
            option.value = cls;
            option.textContent = cls;
            this.assignClass.appendChild(option);
        });

        // Grade student dropdown
        this.gradeStudent.innerHTML = '<option value="">Select Student</option>';
        this.students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} (${student.roll})`;
            this.gradeStudent.appendChild(option);
        });
    }

    // ================= STUDENTS =================

    addStudent() {
        const name = this.nameInput.value.trim();
        const roll = this.rollInput.value.trim();
        const cls = this.classInput.value.trim();
        const email = this.emailInput.value.trim();

        if (this.students.some(s => s.roll === roll)) {
            alert('A student with this roll number already exists!');
            return;
        }

        this.students.push({
            id: Date.now(),
            name,
            roll,
            cls,
            email
        });

        this.saveData('students', this.students);
        this.form.reset();
        this.populateSelects();
        this.renderAll();
    }

    deleteStudent(id) {
        if (confirm('Delete this student and all their related data?')) {
            this.students = this.students.filter(s => s.id !== id);
            this.records = this.records.filter(r => r.studentId !== id);
            this.grades = this.grades.filter(g => g.studentId !== id);
            this.saveData('students', this.students);
            this.saveData('records', this.records);
            this.saveData('grades', this.grades);
            this.populateSelects();
            this.renderAll();
        }
    }

    // ================= ATTENDANCE =================

    saveAttendance() {
        const date = this.attendanceDate.value;
        if (!date) {
            alert('Please select a date.');
            return;
        }

        this.records = this.records.filter(r => r.date !== date);

        const selects = this.attendanceTableBody.querySelectorAll('.status-select');
        selects.forEach(select => {
            const studentId = parseInt(select.dataset.student);
            const status = select.value;
            this.records.push({ studentId, date, status });
        });

        this.saveData('records', this.records);
        this.attendanceStatus.textContent = `✅ Attendance saved for ${date}`;
        setTimeout(() => { this.attendanceStatus.textContent = ''; }, 3000);
        this.renderAll();
    }

    // ================= ASSIGNMENTS =================

    addAssignment() {
        const title = this.assignTitle.value.trim();
        const desc = this.assignDesc.value.trim();
        const due = this.assignDue.value;
        const cls = this.assignClass.value;

        if (!title || !due) return;

        this.assignments.push({
            id: Date.now(),
            title,
            desc,
            due,
            cls,
            createdAt: new Date().toISOString()
        });

        this.saveData('assignments', this.assignments);
        this.assignmentForm.reset();
        this.setDefaultDate();
        this.renderAll();
    }

    deleteAssignment(id) {
        if (confirm('Delete this assignment?')) {
            this.assignments = this.assignments.filter(a => a.id !== id);
            this.saveData('assignments', this.assignments);
            this.renderAll();
        }
    }

    assignmentStatus(due) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(due);
        if (dueDate < today) return 'overdue';
        return 'open';
    }

    // ================= GRADES =================

    addGrade() {
        const studentId = parseInt(this.gradeStudent.value);
        const subject = this.gradeSubject.value.trim();
        const score = parseInt(this.gradeScore.value);

        if (!studentId || !subject || isNaN(score)) return;

        this.grades.push({
            id: Date.now(),
            studentId,
            subject,
            score,
            date: new Date().toISOString()
        });

        this.saveData('grades', this.grades);
        this.gradeForm.reset();
        this.renderAll();
    }

    letterGrade(avg) {
        if (avg >= 90) return { letter: 'A', cls: 'letter-a' };
        if (avg >= 80) return { letter: 'B', cls: 'letter-b' };
        if (avg >= 70) return { letter: 'C', cls: 'letter-c' };
        if (avg >= 60) return { letter: 'D', cls: 'letter-d' };
        return { letter: 'F', cls: 'letter-f' };
    }

    // ================= ANNOUNCEMENTS =================

    postAnnouncement() {
        const title = this.announceTitle.value.trim();
        const body = this.announceBody.value.trim();
        if (!title || !body) return;

        this.announcements.unshift({
            id: Date.now(),
            title,
            body,
            date: new Date().toISOString()
        });

        this.saveData('announcements', this.announcements);
        this.announcementForm.reset();
        this.renderAll();
    }

    deleteAnnouncement(id) {
        if (confirm('Delete this announcement?')) {
            this.announcements = this.announcements.filter(a => a.id !== id);
            this.saveData('announcements', this.announcements);
            this.renderAll();
        }
    }

    formatDate(iso) {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // ================= RENDER =================

    renderAll() {
        this.renderStudents();
        this.renderAttendanceList();
        this.renderAssignments();
        this.renderGrades();
        this.renderAnnouncements();
        this.renderDashboard();
    }

    renderStudents() {
        this.studentTableBody.innerHTML = '';
        this.noStudents.style.display = this.students.length === 0 ? 'block' : 'none';
        this.studentCount.textContent = `(${this.students.length})`;

        this.students.forEach(student => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.roll}</td>
                <td>${student.name}</td>
                <td>${student.cls || '-'}</td>
                <td>${student.email || '-'}</td>
                <td>
                    <button class="btn small danger" data-id="${student.id}"><i class="fas fa-trash"></i> Delete</button>
                </td>
            `;
            tr.querySelector('.btn').addEventListener('click', () => {
                this.deleteStudent(student.id);
            });
            this.studentTableBody.appendChild(tr);
        });
    }

    renderAttendanceList() {
        this.attendanceTableBody.innerHTML = '';
        this.noAttendance.style.display = this.students.length === 0 ? 'block' : 'none';
        this.saveAttendanceBtn.style.display = this.students.length === 0 ? 'none' : 'block';

        const date = this.attendanceDate.value;
        const existingRecords = this.records.filter(r => r.date === date);

        this.students.forEach(student => {
            const existing = existingRecords.find(r => r.studentId === student.id);
            const status = existing ? existing.status : 'present';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.roll}</td>
                <td>${student.name}</td>
                <td>
                    <select class="status-select" data-student="${student.id}">
                        <option value="present" ${status === 'present' ? 'selected' : ''}>Present</option>
                        <option value="absent" ${status === 'absent' ? 'selected' : ''}>Absent</option>
                        <option value="leave" ${status === 'leave' ? 'selected' : ''}>Leave</option>
                    </select>
                </td>
            `;
            this.attendanceTableBody.appendChild(tr);
        });
    }

    renderAssignments() {
        this.assignmentTableBody.innerHTML = '';
        this.noAssignments.style.display = this.assignments.length === 0 ? 'block' : 'none';
        this.assignmentCount.textContent = `(${this.assignments.length})`;

        // Sort by due date ascending (soonest first)
        const sorted = [...this.assignments].sort((a, b) => a.due.localeCompare(b.due));

        sorted.forEach(assignment => {
            const status = this.assignmentStatus(assignment.due);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${assignment.title}</strong></td>
                <td>${assignment.desc || '-'}</td>
                <td>${assignment.cls || 'All'}</td>
                <td>${this.formatDate(assignment.due)}</td>
                <td><span class="badge ${status}">${status === 'open' ? 'Open' : 'Overdue'}</span></td>
                <td>
                    <button class="btn small danger" data-id="${assignment.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tr.querySelector('.btn').addEventListener('click', () => {
                this.deleteAssignment(assignment.id);
            });
            this.assignmentTableBody.appendChild(tr);
        });
    }

    renderGrades() {
        this.gradesTableBody.innerHTML = '';
        this.noGrades.style.display = this.students.length === 0 ? 'block' : 'none';

        this.students.forEach(student => {
            const studentGrades = this.grades.filter(g => g.studentId === student.id);
            const total = studentGrades.length;
            const avg = total > 0 ? studentGrades.reduce((s, g) => s + g.score, 0) / total : 0;
            const grade = this.letterGrade(avg);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.roll}</td>
                <td>${student.name}</td>
                <td>${total}</td>
                <td>${total > 0 ? avg.toFixed(1) + '%' : '-'}</td>
                <td>${total > 0 ? `<span class="badge ${grade.cls}">${grade.letter}</span>` : '-'}</td>
            `;
            this.gradesTableBody.appendChild(tr);
        });
    }

    renderAnnouncements() {
        // Full list
        this.announcementList.innerHTML = '';
        this.noAnnouncementsFull.style.display = this.announcements.length === 0 ? 'block' : 'none';

        this.announcements.forEach(ann => {
            const item = document.createElement('div');
            item.className = 'announcement-item';
            item.innerHTML = `
                <h4><i class="fas fa-bullhorn"></i> ${ann.title}</h4>
                <p>${ann.body}</p>
                <div class="announce-item-meta">
                    <span>${this.formatDate(ann.date)}</span>
                    <button class="btn small danger" data-id="${ann.id}"><i class="fas fa-trash"></i> Delete</button>
                </div>
            `;
            item.querySelector('.btn').addEventListener('click', () => {
                this.deleteAnnouncement(ann.id);
            });
            this.announcementList.appendChild(item);
        });

        // Latest 3 for dashboard
        this.latestAnnouncements.innerHTML = '';
        this.noAnnouncements.style.display = this.announcements.length === 0 ? 'block' : 'none';
        this.announcements.slice(0, 3).forEach(ann => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-bullhorn" style="color: var(--primary); margin-right: 8px;"></i>
                <strong>${ann.title}</strong> — <span style="color: var(--text-muted);">${this.formatDate(ann.date)}</span>`;
            this.latestAnnouncements.appendChild(li);
        });
    }

    renderDashboard() {
        // Student count
        this.statStudents.textContent = this.students.length;

        // Average attendance
        const totalMarks = this.records.length;
        const presentMarks = this.records.filter(r => r.status === 'present' || r.status === 'leave').length;
        const avgAttendance = totalMarks > 0 ? Math.round((presentMarks / totalMarks) * 100) : 0;
        this.statAttendance.textContent = avgAttendance + '%';

        // Assignments count
        this.statAssignments.textContent = this.assignments.length;

        // Average grade
        const allGrades = this.grades.map(g => g.score);
        const avgGrade = allGrades.length > 0 ? allGrades.reduce((a, b) => a + b, 0) / allGrades.length : null;
        this.statAvgGrade.textContent = avgGrade !== null ? avgGrade.toFixed(1) + '%' : '-';

        // Top performers
        this.topPerformers.innerHTML = '';
        const performers = this.students.map(student => {
            const studentGrades = this.grades.filter(g => g.studentId === student.id);
            const avg = studentGrades.length > 0 ? studentGrades.reduce((s, g) => s + g.score, 0) / studentGrades.length : 0;
            const studentRecords = this.records.filter(r => r.studentId === student.id);
            const present = studentRecords.filter(r => r.status === 'present' || r.status === 'leave').length;
            const attPct = studentRecords.length > 0 ? Math.round((present / studentRecords.length) * 100) : 0;
            return { name: student.name, roll: student.roll, avg, attPct };
        }).filter(p => p.avg > 0).sort((a, b) => b.avg - a.avg).slice(0, 5);

        this.noPerformers.style.display = performers.length === 0 ? 'block' : 'none';

        performers.forEach((p, i) => {
            const grade = this.letterGrade(p.avg);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${p.name} <span class="count-badge" style="background:#eef0f7;color:var(--text-muted);">${p.roll}</span></td>
                <td>${p.attPct}%</td>
                <td><span class="badge ${grade.cls}">${grade.letter}</span></td>
            `;
            this.topPerformers.appendChild(tr);
        });
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SmartEduApp();
});
