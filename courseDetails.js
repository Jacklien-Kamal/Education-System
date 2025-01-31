document.addEventListener("DOMContentLoaded", () => {
    const courseDetailsContainer =
      document.getElementById("course-details");
    const goBackBtn = document.getElementById("goBackBtn");

    const urlParams = new URLSearchParams(window.location.search);
    const courseCode = urlParams.get("course");
    const feedbackData =
      JSON.parse(localStorage.getItem("courseFeedback")) || {};
    const courses = JSON.parse(localStorage.getItem("courses")) || {};
    console.log(courses);
    const currentCourse = courses.find((c) => c.code === courseCode);
    console.log(currentCourse);

    const courseFeedback = feedbackData[courseCode] || [];

    const renderCourseDetails = (courseCode, courseFeedback) => {
      const course = {
        title: `Course ${courseCode}`,
        university: "Example University",
      };

      const categoryAverages = calculateCategoryAverages(courseFeedback);
      const overallRating = categoryAverages.overallAverage;
      const grade = getGrade(overallRating);

      // Build the stars for the overall rating
      const overallStars = getStars(overallRating);

      courseDetailsContainer.innerHTML = `
    
<section class="rate">
  <article class='topRate'>
    <div>
      <div class="badge">C${currentCourse.code}</div>
      <h1 class="title" >${currentCourse.title}</h1>



${["Explanation", "Course Difficulty", "Resources", "Assignments", "Projects"]
.map((category) => {
const categoryRating = categoryAverages[category] || 0;
return `
      <div class="category">
              <p class='lightTxt'>${category}</p>
              <p class="star-rating">
                ${getStars(categoryRating)}
              
              </p>
            </div>
          `;
})
.join("")}



</div>

      

      
             <span>
                <p class="xsLightTxt">Avg. Grade</p>
                <div class="grade">${grade}</div>

                <button class='submit-feedback-btn'>+Add Feedback</button>
              </span>


    </article>
      </section>

      <div class="satisfaction">
        <div>Overall Satisfaction</div>
          <h3>${overallStars}</h3>
      </div>
     
     
      <div id="feedback-modal" style="background-color: #222; padding: 20px; border-radius: 10px;">
        ${[
          "Explanation",
          "Course Difficulty",
          "Resources",
          "Assignments",
          "Projects",
        ]
          .map(
            (category) => `
            <div>
              <label style="color: white;">${category}</label>
              <div class="star-rating" data-category="${category}">
                ${[1, 2, 3, 4, 5]
                  .map(
                    (i) => `<span class="star" data-value="${i}">☆</span>`
                  )
                  .join("")}
              </div>
            </div>
          `
          )
          .join("")}

          
        <div>
          <label for="comment" style="color: white;">Your Comment</label>
          <textarea id="comment" rows="4" style=" padding: 5px; border-radius: 8px;"></textarea>
        </div>

        <div style="margin-top: 15px;">
          <button id="submitFeedback">Submit Feedback</button>
        </div>
      </div>
 <!-- Recommendation Section with Upload functionality -->
<section class="recommendation">
  <h1>Recommendation</h1>
  <article class="recCont">
    <div class="slideCont">
      <label for="fileUpload" class="uploadLabel">Upload DOC Files</label>
      <input type="file" id="fileUpload" accept=".doc,.docx,.ppt,.pptx" multiple onchange="handleFileUpload(event)" />
      <div id="fileListContainer"></div> <!-- Placeholder for file list -->
    </div>
    <div class="sugCont">
      <h2>Suggestion</h2>
      <textarea placeholder="Add your suggestions here"></textarea>
    </div>
  </article>
</section>
      

      <div class="commentsCont">
        <h1>Comments</h1>



        ${
          courseFeedback.length > 0
            ? courseFeedback
                .map(
                  (feedback) => `
                  
              <div class="comment">
                   <div>${feedback.comment} </div>
             </div>
          `
                )
                .join("")
            : "<p>No feedback available yet.</p>"
        }
      </div>
    `;

      let feedback = {};

      document.querySelectorAll(".star-rating").forEach((starRating) => {
        starRating.addEventListener("click", (event) => {
          const stars = event.target
            .closest(".star-rating")
            .querySelectorAll(".star");
          const ratingValue = event.target.dataset.value;

          stars.forEach((star) => {
            star.textContent =
              parseInt(star.dataset.value) <= parseInt(ratingValue)
                ? "★"
                : "☆";
          });

          const category =
            event.target.closest(".star-rating").dataset.category;
          feedback[category] = parseInt(ratingValue, 10);
        });
      });

      document
        .getElementById("submitFeedback")
        .addEventListener("click", () => {
          let total = 0;
          let comment = document.getElementById("comment").value.trim();

          document
            .querySelectorAll(".star-rating")
            .forEach((starRating) => {
              const category = starRating.dataset.category;
              const filledStars = Array.from(
                starRating.querySelectorAll(".star")
              ).filter((star) => star.textContent === "★");
              feedback[category] = filledStars.length;
              total += filledStars.length;
            });

          const averageRating = total / 5;
          saveFeedback(courseCode, feedback, comment, averageRating);
          document.getElementById("feedback-modal").style.display = "none";
          document.getElementById("overlay").style.display = "none";
          renderCourseDetails(courseCode, feedbackData);
        });

      function calculateCategoryAverages(feedbacks) {
        const categoryRatings = {
          Explanation: [],
          "Course Difficulty": [],
          Resources: [],
          Assignments: [],
          Projects: [],
        };

        feedbacks.forEach((feedback) => {
          for (let category in categoryRatings) {
            categoryRatings[category].push(feedback[category] || 0);
          }
        });

        const averages = {};
        let overallTotal = 0;

        for (let category in categoryRatings) {
          const categoryAvg =
            categoryRatings[category].length > 0
              ? categoryRatings[category].reduce(
                  (sum, rating) => sum + rating,
                  0
                ) / categoryRatings[category].length
              : 0;
          averages[category] = categoryAvg;
          overallTotal += categoryAvg;
        }

        averages.overallAverage =
          overallTotal / Object.keys(categoryRatings).length;

        return averages;
      }

      function getGrade(rating) {
        if (rating >= 4.8) return "A+";
        if (rating >= 4.5) return "A";
        if (rating >= 4.0) return "B+";
        if (rating >= 3.5) return "B";
        if (rating >= 3.0) return "B-";
        if (rating >= 2.5) return "C+";
        if (rating >= 2.0) return "C";
        if (rating >= 0) return "D";
        return "D";
      }

      function getStars(rating) {
        return [1, 2, 3, 4, 5]
          .map((i) => (i <= rating ? "★" : "☆"))
          .join("");
      }
    };

    function saveFeedback(courseCode, feedback, comment, averageRating) {
      let allFeedback =
        JSON.parse(localStorage.getItem("courseFeedback")) || {};
      if (!allFeedback[courseCode]) {
        allFeedback[courseCode] = [];
      }

      const feedbackItem = {
        ...feedback,
        comment: comment,
      };

      allFeedback[courseCode].push(feedbackItem);
      localStorage.setItem("courseFeedback", JSON.stringify(allFeedback));
    }

    renderCourseDetails(courseCode, courseFeedback);

    if (goBackBtn) {
      goBackBtn.addEventListener("click", () => {
        window.history.back();
      });
    }
    const feedbackModal = document.getElementById("feedback-modal");
    const overlay = document.getElementById("overlay");
    const addFeedbackBtn = document.querySelector(".submit-feedback-btn");
    const closeBtn = document.createElement("button");

    // Create the close button
    closeBtn.textContent = "Close";
    closeBtn.classList.add("close-btn");
    feedbackModal.insertBefore(closeBtn, feedbackModal.firstChild);

    // Show popup
    addFeedbackBtn.addEventListener("click", () => {
      feedbackModal.style.display = "block";
      overlay.style.display = "block";
    });

    // Hide popup
    const closePopup = () => {
      feedbackModal.style.display = "none";
      overlay.style.display = "none";
    };

    closeBtn.addEventListener("click", closePopup);
    overlay.addEventListener("click", closePopup);
  });

// Keep track of uploaded files
let uploadedFiles = [];

function handleFileUpload(event) {
const fileListContainer = document.getElementById("fileListContainer");
const files = Array.from(event.target.files);

// Add new files to the uploadedFiles list
uploadedFiles = uploadedFiles.concat(files);

// Clear the display container
fileListContainer.innerHTML = "";

// Display all uploaded files
uploadedFiles.forEach(file => {
const fileItem = document.createElement("div");
fileItem.classList.add("file-item");

const fileIcon = document.createElement("img");
fileIcon.src = "./img/icons/image 8.png";
fileIcon.width = 40;
fileIcon.style.marginRight = "10px";

const fileName = document.createElement("span");
fileName.textContent = file.name;

fileItem.appendChild(fileIcon);
fileItem.appendChild(fileName);

fileListContainer.appendChild(fileItem);
});
}

