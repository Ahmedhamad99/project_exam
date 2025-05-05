
// import { Component, OnInit } from '@angular/core';
// import { ExamService } from '../../services/exam.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule, NgModel } from '@angular/forms';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatListModule } from '@angular/material/list';
// import { MatSelectModule } from '@angular/material/select';
// @Component({
//   selector: 'app-admin',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
    
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatListModule,
//     MatSelectModule,
    
//   ],
//   templateUrl: './admin.component.html',
//   styleUrls: ['./admin.component.css']
// })
// export class AdminComponent implements OnInit {
//   exams: any[] = [];
//   newExam = { title: '', description: '' };
//   newQuestion = { examId: '', text: '', options: ['', '', '', ''], correctAnswer: '' };

//   constructor(private examService: ExamService) {}

//   ngOnInit() {
//     this.loadExams();
//   }

//   loadExams() {
//     this.examService.getExams().subscribe({
//       next: (res) => {
//         this.exams = res;
//       },
//       error: (err) => {
//         console.error('Error fetching exams:', err);
//       }
//     });
//   }

//   addExam() {
//     this.examService.createExam(this.newExam).subscribe({
//       next: (res) => {
//         this.exams.push(res);
//         this.newExam = { title: '', description: '' };
//       },
//       error: (err) => {
//         console.error('Error creating exam:', err);
//       }
//     });
//   }

//   addQuestion() {
//     if (!this.newQuestion.examId || !this.newQuestion.text || !this.newQuestion.correctAnswer || this.newQuestion.options.some(opt => !opt)) {
//       console.error('Invalid question data:', this.newQuestion);
//       return;
//     }
//     console.log('Sending question:', this.newQuestion);
//     this.examService.addQuestion(this.newQuestion.examId, this.newQuestion).subscribe({
//       next: (res) => {
//         const exam = this.exams.find(e => e._id === this.newQuestion.examId);
//         if (exam) {
//           exam.questions = exam.questions || [];
//           exam.questions.push(res);
//         }
//         this.newQuestion = { examId: '', text: '', options: ['', '', '', ''], correctAnswer: '' };
//       },
//       error: (err) => {
//         console.error('Error adding question:', err);
//       }
//     });
//   }
// }



import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // استبدل FormsModule بـ ReactiveFormsModule
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatSelectModule,
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  exams: any[] = [];
  examForm: FormGroup;
  questionForm: FormGroup;

  constructor(private fb: FormBuilder, private examService: ExamService) {
    // نموذج إنشاء الامتحان
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });

    // نموذج إضافة السؤال
    this.questionForm = this.fb.group({
      examId: ['', Validators.required],
      text: ['', Validators.required],
      options: this.fb.array([
        ['', Validators.required],
        ['', Validators.required],
        ['', Validators.required],
        ['', Validators.required]
      ]),
      correctAnswer: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadExams();
  }

  // تحميل الامتحانات
  loadExams() {
    this.examService.getExams().subscribe({
      next: (res) => {
        this.exams = res;
      },
      error: (err) => {
        console.error('Error fetching exams:', err);
      }
    });
  }

  // إضافة امتحان
  addExam() {
    if (this.examForm.invalid) {
      console.error('Invalid exam data:', this.examForm.value);
      return;
    }
    this.examService.createExam(this.examForm.value).subscribe({
      next: (res) => {
        this.exams.push(res);
        this.examForm.reset();
      },
      error: (err) => {
        console.error('Error creating exam:', err);
      }
    });
  }

  // إضافة سؤال
  addQuestion() {
    if (this.questionForm.invalid) {
      console.error('Invalid question data:', this.questionForm.value);
      return;
    }
    console.log('Sending question:', this.questionForm.value);
    this.examService.addQuestion(this.questionForm.value.examId, this.questionForm.value).subscribe({
      next: (res) => {
        const exam = this.exams.find(e => e._id === this.questionForm.value.examId);
        if (exam) {
          exam.questions = exam.questions || [];
          exam.questions.push(res);
        }
        this.questionForm.reset();
      },
      error: (err) => {
        console.error('Error adding question:', err);
      }
    });
  }

  // Getter للوصول إلى options كـ FormArray
  get options() {
    return this.questionForm.get('options') as FormArray;
  }

  trackByFn(index: number) {
    return index;
  }
}