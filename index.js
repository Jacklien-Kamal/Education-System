function preloadFeedback() {
  const initialFeedback = {
    CS346: [
      { stars: 5, comment: "Amazing course!" },
      { stars: 4, comment: "Good content but a bit fast." },
    ],
    CS250: [{ stars: 4, comment: "Loved the practical examples!" }],
    CS450: [{ stars: 3, comment: "Challenging but rewarding." }],
    CS101: [{ stars: 5, comment: "Great introduction to programming!" }],
    CS202: [{ stars: 4, comment: "Useful and practical concepts." }],
    CS303: [],
  };

  if (!localStorage.getItem("courseFeedback")) {
    localStorage.setItem("courseFeedback", JSON.stringify(initialFeedback));
  }
}
preloadFeedback();

document.addEventListener("DOMContentLoaded", function () {
  const feedbackData = JSON.parse(localStorage.getItem("courseFeedback")) || {};

  // تحويل الكائن إلى مصفوفة من الدورات المتاحة
  const courses = Object.keys(feedbackData).map((code) => ({
    code,
    title: `Course ${code}`,
    department: "Computer Science",
    hours: 40,
    university: "Example University",
  }));

  // الحصول على الحاوية التي سيتم إضافة الكروت إليها
  const cardsContainer = document.querySelector(".cardsCont");

  // دالة لإنشاء كارت الدورة
  function createCourseCard(course) {
    return `  <a href="./courseDetails.html?course=${course.code}">
      <div class="card">
        <img src="./img/rec.png" />
        <span style="display: flex; align-items: center; justify-content: space-between;">
          <p class="xsLightTxt">${course.department || "Computer Science"}</p>
          <img src="./img/icons/stars.png" />
        </span>
        <p>${course.title}</p>
        <h3 style="color: #ff7426">${course.code}</h3>
        <span class="xsLightTxt" style="display: flex; align-items: center; gap: 10px">
          <img src="./img/icons/time-svgrepo-com 1.png" />
          <p>${course.hours} hours</p>
          <img src="./img/icons/Graduation Cap 02.png" />
          <p>${course.university || "Unknown University"}</p>
        </span>
        <button class="orangBtn">
        Give Feedback
        </button>
      </div>
      </a>
    `;
  }

  // اختيار أول 3 دورات فقط للعرض
  const displayedCourses = courses.slice(0, 3);

  // إضافة الكروت إلى الصفحة
  cardsContainer.innerHTML = displayedCourses.map(createCourseCard).join("");
});




class Carousel {
    constructor(container, cardsData) {
      this.container = document.querySelector(container);
      this.track = this.container.querySelector(".carousel-track");
      this.dotsContainer = this.container.querySelector(".carousel-dots");

  
      this.cardsData = cardsData;
      this.currentIndex = 0;
  
      this.init();
    }
  
    init() {
      this.renderCards();
      this.renderDots();
      this.updateCarousel();
  
 
      this.dotsContainer.addEventListener("click", (e) => this.dotNavigation(e));
    }
  
    renderCards() {
      this.track.innerHTML = this.cardsData
        .map(
          (card, index) => `
          <div class="carouselCard" data-index="${index}">
            <p>${card.content}</p>
            <span class='iconCont'><img src='./img/./icons/icon.png'/>${card.author}</span>
            <p class='xsLightTxt'>${card.code}</>
          </div>
        `
        )
        .join("");
    }
  
    renderDots() {
      this.dotsContainer.innerHTML = this.cardsData
        .map(
          (_, index) => `
          <span class="dot ${index === 0 ? "active" : ""}" data-index="${index}"></span>
        `
        )
        .join("");
    }
  
    updateCarousel() {
      const cardWidth = this.track.children[0].offsetWidth + 20; // Card width + margin
      this.track.style.transform = `translateX(-${this.currentIndex * cardWidth}px)`;
  
      // Update dots
      this.dotsContainer.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === this.currentIndex);
      });
  
      
    }
  
    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.updateCarousel();
      }
    }
  
    nextSlide() {
      if (this.currentIndex < this.cardsData.length - 1) {
        this.currentIndex++;
        this.updateCarousel();
      }
    }
  
    dotNavigation(e) {
      if (e.target.classList.contains("dot")) {
        this.currentIndex = parseInt(e.target.getAttribute("data-index"));
        this.updateCarousel();
      }
    }
  }
  
  // Sample data for cards
  const cardsData = [
    { content: "Teachings of the great explore of truth, the master-builder of human happiness. no one rejects,dislikes, or avoids pleasure itself, pleasure itself", author: "Anonymous ",code:"CS456" },
    { content: "Complete account of the system andexpound the actual Contrary to popularbelief, Lorem Ipsum is not simply random text. It has roots”", author: "Anonymous " ,code:"CS456"},
    { content: "“There are many variations of passagesof Lorem Ipsum available, but the majorityhave suffered alteration in some form,by injected humour”", author: "Anonymous CS987" ,code:"CS456"},
    { content: "Lorem Ipsum is simply dummy text.", author: "Anonymous " ,code:"CS456"},
    { content: "Contrary to popular belief.", author: "Anonymous " ,code:"CS456" },
    { content: "The printing and typesetting industry.", author: "Anonymous ",code:"CS456" },
  ];
  
  // Initialize the carousel
  new Carousel(".carousel", cardsData);


  // ///////////////////////////////////////////////////////////////////////////////////////////////////
