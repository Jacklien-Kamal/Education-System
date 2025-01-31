class FeedbackManager {
  static getFeedbackData() {
    return JSON.parse(localStorage.getItem("courseFeedback")) || {};
  }

  static setFeedbackData(feedbackData) {
    localStorage.setItem("courseFeedback", JSON.stringify(feedbackData));
  }

  static saveFeedback(courseCode, feedback) {
    const feedbackData = this.getFeedbackData();
    if (!feedbackData[courseCode]) feedbackData[courseCode] = [];
    feedbackData[courseCode].push(feedback);

    // Update the course object in localStorage with the new average rating
    const averageRating = this.calculateAverageRating(courseCode);
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const course = courses.find(course => course.code === courseCode);
    if (course) course.averageRating = averageRating;
    localStorage.setItem("courses", JSON.stringify(courses));

    this.setFeedbackData(feedbackData);
  }

  static getFeedback(courseCode) {
    const feedbackData = this.getFeedbackData();
    return feedbackData[courseCode] || [];
  }

  static preloadFeedback() {
    const initialFeedback = {
      CS346: [
          {
              "Assignments": 5,
              "Resources": 5,
              "Course Difficulty": 5,
              "Projects": 5,
              "Explanation": 4,
              "comment": "goooood"
          },
          {
              "Assignments": 5,
              "Resources": 5,
              "Course Difficulty": 4,
              "Projects": 5,
              "Explanation": 5,
              "comment": "Great course, lots of practical examples!"
          }
      ],
      CS250: [
          {
              "Assignments": 4,
              "Resources": 5,
              "Course Difficulty": 3,
              "Projects": 4,
              "Explanation": 4,
              "comment": "Loved the practical examples!"
          },
          {
              "Assignments": 5,
              "Resources": 5,
              "Course Difficulty": 4,
              "Projects": 5,
              "Explanation": 5,
              "comment": "Excellent course with great resources and assignments!"
          }
      ],
      CS450: [
          {
              "Assignments": 3,
              "Resources": 4,
              "Course Difficulty": 5,
              "Projects": 4,
              "Explanation": 3,
              "comment": "Challenging but rewarding."
          },
          {
              "Assignments": 4,
              "Resources": 4,
              "Course Difficulty": 4,
              "Projects": 5,
              "Explanation": 4,
              "comment": "Well structured course, but quite difficult."
          }
      ],
      CS101: [
          {
              "Assignments": 5,
              "Resources": 5,
              "Course Difficulty": 3,
              "Projects": 5,
              "Explanation": 5,
              "comment": "Great introduction to programming!"
          },
          {
              "Assignments": 4,
              "Resources": 4,
              "Course Difficulty": 3,
              "Projects": 4,
              "Explanation": 4,
              "comment": "Good course for beginners, but a little more challenging than expected."
          }
      ],
      CS202: [
          {
              "Assignments": 4,
              "Resources": 5,
              "Course Difficulty": 4,
              "Projects": 5,
              "Explanation": 5,
              "comment": "Useful and practical concepts."
          },
          {
              "Assignments": 5,
              "Resources": 5,
              "Course Difficulty": 3,
              "Projects": 5,
              "Explanation": 4,
              "comment": "Good course, but some topics need more explanation."
          }
      ],
      CS303: [
          {
              "Assignments": 3,
              "Resources": 5,
              "Course Difficulty": 5,
              "Projects": 4,
              "Explanation": 4,
              "comment": "Challenging but rewarding course."
          }
      ]
  }
  

    if (!localStorage.getItem("courseFeedback")) {
      this.setFeedbackData(initialFeedback);
    }
  }

  static calculateAverageRating(courseCode) {
    const feedbacks = this.getFeedback(courseCode);
    if (feedbacks.length === 0) return 0;
  
    const totalStars = feedbacks.reduce((sum, feedback) => {
      const ratings = Object.values(feedback).slice(0, -1); // Exclude the 'comment' property
      const sumRatings = ratings.reduce((acc, rating) => acc + rating, 0);
      return sum + sumRatings / ratings.length; // Average of ratings
    }, 0);
  
    return totalStars / feedbacks.length; // Final average for the course
  }
  
}

class CourseCard {
  constructor({ title, code, department, hours, university, imgSrc }) {
    this.title = title;
    this.code = code;
    this.department = department;
    this.hours = hours;
    this.university = university;
    this.imgSrc = imgSrc;
  }

  getRatingHTML() {
    const averageRating = FeedbackManager.calculateAverageRating(this.code);
    const fullStars = Math.floor(averageRating); // Full stars based on integer part
    const halfStar = averageRating % 1 >= 0.5 ? 1 : 0; // Handle half stars if necessary
    const emptyStars = 5 - fullStars - halfStar; // Remaining stars

    // Return the filled, half, and empty stars
    return `★`.repeat(fullStars) + (halfStar ? `✩` : '') + `☆`.repeat(emptyStars);
  }
  
  render() {
    const card = document.createElement("div");
    card.style = `
      position: relative; padding: 13px; background: #ffffff;
      box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.1);
      border-radius: 14px; display: flex; flex-direction: column;
      max-width: 400px; margin: 10px; margin-bottom: 40px;
    `;
  
    card.innerHTML = `
      <a href="./courseDetails.html?course=${this.code}">
        <img src="${this.imgSrc}" alt="Course Image" style="width: 100%; border-radius: 8px;" />
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <p style="font-size: 14px; color: #6c757d;">${this.department}</p>
          <div style="font-size: 20px; color: #ff7426;">
            ${this.getRatingHTML()}  <!-- Display average rating stars -->
          </div>
        </div>
        <p style="font-size: 16px; font-weight: bold; color: black;">${this.title}</p>
        <h3 style="color: #ff7426; font-size: 20px;">${this.code}</h3>
        <div style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #6c757d;">
          <img src="./img/icons/time-svgrepo-com 1.png" alt="Time Icon" style="width: 16px; height: 16px;" />
          <p>${this.hours} hours</p>
          <img src="./img/icons/Graduation Cap 02.png" alt="University Icon" style="width: 16px; height: 16px;" />
          <p>${this.university}</p>
        </div>
        <button class="feedback-btn" style="width: 160px; height: 40px; border: 0px; color: white; font-size: 20px; border-radius: 96px; background-color: #ff7426; margin: 13px auto;">
          <a href="./courseDetails.html?course=${this.code}">Give Feedback</a>
        </button>
      </a>
    `;
  
    return card;
  }

  renderFeedbackList(feedbackList) {
    const feedbacks = FeedbackManager.getFeedback(this.code);
    feedbackList.innerHTML = feedbacks
      .map(feedback => {
        const averageFeedbackRating = (
          Object.values(feedback).slice(0, -1).reduce((acc, val) => acc + val, 0) / 5
        ).toFixed(0);
        return `
          <li style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
            <span style="color: #ff7426; font-weight: bold;">
              ${"★".repeat(averageFeedbackRating)}${"☆".repeat(5 - averageFeedbackRating)}
            </span>
            <p style="font-size: 14px; color: #333;">${feedback.comment}</p>
          </li>
        `;
      })
      .join("");
  }
  
}


class CourseGrid {
  constructor(gridId) {
    this.gridElement = document.getElementById(gridId);
    if (!this.gridElement) {
      throw new Error(`Element with ID '${gridId}' not found.`);
    }

    this.gridElement.style = `
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0px;
      padding: 20px 300px;
    `;
  }

  addCourseCard(courseData) {
    const courseCard = new CourseCard(courseData);
    this.gridElement.appendChild(courseCard.render());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  FeedbackManager.preloadFeedback();

  // Store courses in localStorage if they aren't already saved
  if (!localStorage.getItem("courses")) {
    const courses = [
      { title: "Machine Learning", code: "CS346", department: "Computer Science", hours: 4, university: "Imam Mohammad Ibn Saud University", imgSrc: "./img/rec.png" },
      { title: "Data Structures", code: "CS250", department: "Computer Science", hours: 3, university: "Imam Mohammad Ibn Saud University", imgSrc: "./img/rec.png" },
      { title: "Operating Systems", code: "CS450", department: "Computer Science", hours: 4, university: "Imam Mohammad Ibn Saud University", imgSrc: "./img/rec.png" },
      { title: "Intro to Programming", code: "CS101", department: "Computer Science", hours: 2, university: "Imam Mohammad Ibn Saud University", imgSrc: "./img/rec.png" },
      { title: "Advanced Algorithms", code: "CS202", department: "Computer Science", hours: 4, university: "Imam Mohammad Ibn Saud University", imgSrc: "./img/rec.png" },
      { title: "Software Engineering", code: "CS303", department: "Computer Science", hours: 3, university: "Imam Mohammad Ibn Saud University", imgSrc: "./img/rec.png" },
    ];

    localStorage.setItem("courses", JSON.stringify(courses));
  }

  const courseGrid = new CourseGrid("courses");
  const notFoundMessage = document.getElementById("not-found");

  // Retrieve courses from localStorage and add them to the grid
  const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
  storedCourses.forEach(course => courseGrid.addCourseCard(course));




/* SEARCH WITH BUTTON */

  // // "Continue" button functionality
  // const continueButton = document.querySelector('.continue-btn');
  // const searchInput = document.querySelector('.search');

  // continueButton.addEventListener('click', () => {
  //   const query = searchInput.value.toLowerCase();
  //   const filteredCourses = storedCourses.filter(course => course.title.toLowerCase().includes(query));

  //   // Clear the current grid and add filtered courses
  //   courseGrid.gridElement.innerHTML = '';
  //   filteredCourses.forEach(course => courseGrid.addCourseCard(course));

  //   // Show "Not Found" message if no courses match the query
  //   notFoundMessage.style.display = filteredCourses.length === 0 ? "block" : "none";
  // });




  /* SEARCH AUTOMATICALLLY WITHOUT BUTTON */

    // Search functionality
    const searchInput = document.querySelector('.search');
    searchInput.addEventListener('input', (event) => {
      const query = event.target.value.toLowerCase();
      const filteredCourses = storedCourses.filter(course => course.title.toLowerCase().includes(query));
  
      // Clear the current grid and add filtered courses
      courseGrid.gridElement.innerHTML = '';
      filteredCourses.forEach(course => courseGrid.addCourseCard(course));
  
      // Show "Not Found" message if no courses match the query
      if (filteredCourses.length === 0) {
        notFoundMessage.style.display = "block";
      } else {
        notFoundMessage.style.display = "none";
      }
    });
});
