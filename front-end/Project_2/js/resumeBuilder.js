// JSON
var bio = {
    "name": "Adem Ramadani",
    "role": "Student & Programmer",
    "contacts":
    {
        "mobile": "+41 76 000 11 22",
        "email": "ademramadani@hotmail.com",
        "github": "AdemRamadani",
        "twitter": "@AdemRamadani93",
        "location": "Basel-Stadt, Switzerland"
    },
    "welcomeMessage": "Thank you for visiting my online resume!",
    "skills": ["HTML5", "CSS3", "JS", "Jquery", "JSON", "R", "Ruby on Rails"],
    "bioPic": "images/fry.jpg"
};

var education = {
    "schools": [
        {
            "name": "The Open University",
            "location": "Milton Keynes, Great Britain",
            "degree": "BSc (Honours)",
            "dates": "2015-2018",
            "major": ["Computing and IT (Computer Science)"],
            "url": "http://www.open.ac.uk/"
        },
    ],
    "onlineCourses": [
        {
            "title": "Javascript for Beginners",
            "school": "Udacity",
            "dates": "2015",
            "url": "https://www.udacity.com/course/ud804"
        }
    ]
};

var projects = {
    "project": [
        {
            "title": "Project 1",
            "dates": "2015",
            "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
            "images": ["images/150x150.png"]
        },
    ]
};

var work = {
    "jobs": [
        {
            "employer": "None",
            "title": "Programmer",
            "location": "Abondoned, Svalbard",
            "dates": "October 2015",
            "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium."
        },
    ]
};


bio.display = function()
{
  var f1 = bio.skills.length;

  if (f1 > 0)
  {

      var name1 = HTMLheaderName.replace("%data%", bio.name);
      $("#topContacts").before(name1);

      var role1 = HTMLheaderRole.replace("%data%", bio.role);
      $("#topContacts").before(role1);

      var mobile1 = HTMLmobile.replace("%data%", bio.contacts.mobile);
      $("#topContacts").append(mobile1);
      $("#footerContacts").append(mobile1);

      var email1 = HTMLemail.replace("%data%", bio.contacts.email);
      $("#topContacts").append(email1);
      $("#footerContacts").append(email1);

      var twitter1 = HTMLtwitter.replace("%data%", bio.contacts.twitter);
      $("#topContacts").append(twitter1);
      $("#footerContacts").append(twitter1);

      var github1 = HTMLgithub.replace("%data%", bio.contacts.github);
      $("#topContacts").append(github1);
      $("#footerContacts").append(github1);


      var location1 = HTMLlocation.replace("%data%", bio.contacts.location);
      $("#topContacts").append(location1);
      $("#footerContacts").append(location1);

      $("#header").append(HTMLskillsStart);

      var biopic1 = HTMLbioPic.replace("%data%", bio.bioPic);
      $("#skillsH3").before(biopic1);

      var msg1 = HTMLwelcomeMsg.replace("%data%", bio.welcomeMessage);
      $("#skillsH3").before(msg1);

      var formatted = "";
      for (x1 in bio.skills)
      {
          formatted = HTMLskills.replace("%data%", bio.skills[x1]);
          $("#skills").append(formatted);
      }
  }
};

bio.display();

projects.display = function () {
    var p1;
    for (p1 in projects.project) {
        $("#projects").append(HTMLprojectStart);

        var title1 = HTMLprojectTitle.replace("%data%", projects.project[p1].title);
        $(".project-entry:last").append(title1);

        var dates1 = HTMLprojectDates.replace("%data%", projects.project[p1].dates);
        $(".project-entry:last").append(dates1);

        var description1 = HTMLprojectDescription.replace("%data%", projects.project[p1].description);
        $(".project-entry:last").append(description1);

        for (ix in projects.project[p1].images) {
            var image1 = HTMLprojectImage.replace("%data%", projects.project[p1].images[ix]);
            $(".project-entry:last").append(image1);
        }

    }
};

projects.display();

education.display = function () {
    var e1, o1;

    for (e1 in education.schools) {
        $("#education").append(HTMLschoolStart);

        var name1 = HTMLschoolName.replace("%data%", education.schools[e1].name);
        var nameFinal = name1.replace("#", education.schools[e1].url);
        var location1 = HTMLschoolLocation.replace("%data%", education.schools[e1].location);

        var degree1 = HTMLschoolDegree.replace("%data%", education.schools[e1].degree);
        $(".education-entry:last").append(nameFinal + degree1);

        var dates1 = HTMLschoolDates.replace("%data%", education.schools[e1].dates);
        $(".education-entry:last").append(dates1);

        var majors = education.schools[e1].major;
        for (ix in majors) {
            var major1 = HTMLschoolMajor.replace("%data%", majors[ix]);
            $(".education-entry:last").append(major1);
        }
        $(".education-entry:last").append(location1);
    }

    $("#education").append(HTMLonlineClasses);

    for (o1 in education.onlineCourses) {
        $("#education").append(HTMLschoolStart);

        var title1 = HTMLonlineTitle.replace("%data%", education.onlineCourses[o1].title);
        var url1 = HTMLonlineURL.replace("%data%", education.onlineCourses[o1].url);

        var titleFinal = title1.replace("#", education.onlineCourses[o1].url);
        var school1 = HTMLonlineSchool.replace("%data%", education.onlineCourses[o1].school);
        $(".education-entry:last").append(titleFinal + school1);

        var dates1 = HTMLonlineDates.replace("%data%", education.onlineCourses[o1].dates);
        $(".education-entry:last").append(dates1);

        var urlFinal = url1.replace("#", education.onlineCourses[o1].url);
        $(".education-entry:last").append(urlFinal);

    }
};

education.display();

work.display = function() {
    var x1;
    for (x1 in work.jobs) {
        $("#workExperience").append(HTMLworkStart);
        var employer1 = HTMLworkEmployer.replace("%data%", work.jobs[x1].employer);
        var title1 = HTMLworkTitle.replace("%data%", work.jobs[x1].title);
        $(".work-entry:last").append(employer1 + title1);

        var location1 = HTMLworkLocation.replace("%data%", work.jobs[x1].location);
        $(".work-entry:last").append(location1);

        var dates1 = HTMLworkDates.replace("%data%", work.jobs[x1].dates);
        $(".work-entry:last").append(dates1);

        var description1 = HTMLworkDescription.replace("%data%", work.jobs[x1].description);
        $(".work-entry:last").append(description1);
    }
};

work.display();

// International Button
function inName(parm1)
{
    var res = parm1.trim().split(" ");
    res[1] = res[1].toUpperCase();
    res[0] = res[0].slice(0, 1).toUpperCase() + res[0].slice(1).toLowerCase();
    return res[0] + " " + res[1];
}

$("#main").append(internationalizeButton);

// Google Maps
$("#mapDiv").append(googleMap);
