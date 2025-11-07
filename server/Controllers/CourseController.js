const Course = require("../Modles/Course.js");
const {deleteMedia, uploadMedia} = require("../utils/cloudinary.js")
const Lecture = require ("../Modles/lecture.js")

const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      console.log("Missing required fields: courseTitle or category");
      return res.status(400).json({
        message: "courseTitle and category are required",
        success: false,
      });
    }

    // Log the incoming request for creating a course
    console.log(`Creating course: ${courseTitle} in category: ${category}`);

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.tokenId,
    });

    
    console.log(`Course created successfully: ${course._id}`);

    return res.status(200).json({
      message: "Course is created successfully",
      success: true,
    });
  } catch (error) {
    
    console.error("Error creating course:", error);
    res.status(500).json({
      message: "Failed to create course",
      success: false,
    });
  }
};
const fetchCourse = async(req,res)=>{
    try{
        const userId = req.tokenId;
        const courses = await Course.find({creator:userId});
        if(!courses){
            return res.status(404).json({
                corses:[],
                sucess:false,
                message:"course not found",

            })
        }
        return res.status(200).json({
            courses,
            message:"courses Found",
            success:true,

        })


    }catch(error){
        console.error("Error in fetcing course:", error);
        res.status(500).json({
          message: "Failed to Fetch course",
          success: false,
    })
}
}
const editCourse = async (req, res) => {
  try {
    console.log("Starting to update course...");

    const { courseId } = req.params;
    const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
    const thumbnail = req.file; // multer uploads file as a buffer

    console.log("Course ID:", courseId);
    console.log("Incoming data:", {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    });

    let course = await Course.findById(courseId);
    if (!course) {
      console.log("Course not found:", courseId);
      return res.status(404).json({ message: "Course not found", success: false });
    }

    let courseThumbnail;
    if (thumbnail) {
      console.log("New thumbnail detected, uploading to Cloudinary...");

      // Delete existing thumbnail if available
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split('/').pop().split('.')[0];
        console.log("Deleting old thumbnail with public ID:", publicId);
        await deleteMedia(publicId);
      }

      // Upload the new thumbnail to Cloudinary
      const uploadResponse = await uploadMedia(thumbnail.buffer); // Use `buffer` instead of `path`
      courseThumbnail = uploadResponse.secure_url;
      console.log("Thumbnail uploaded successfully:", courseThumbnail);
    }

    // Prepare the update data dynamically
    const updateData = {};
    if (courseTitle) updateData.courseTitle = courseTitle;
    if (subTitle) updateData.subTitle = subTitle;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (courseLevel) updateData.courseLevel = courseLevel;
    if (coursePrice) updateData.coursePrice = coursePrice;
    if (courseThumbnail) updateData.courseThumbnail = courseThumbnail;

    console.log("Updating course with data:", updateData);

    // Update the course
    course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

    console.log("Course updated successfully:", course);

    return res.status(200).json({
      course,
      message: "Course updated successfully",
    });

  } catch (error) {
    console.error("Error during course update:", error);

    res.status(500).json({
      message: "Failed to update course",
      success: false,
      error: error.message,
    });
  }
};


const removeCourse = async (req, res) => {
  try {
    console.log("Starting course deletion...");

    const courseId = req.params.courseId;
    const userId = req.tokenId;

    console.log("Requested Course ID:", courseId);

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      console.log("Course not found:", courseId);
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    // Ensure the user is the creator of the course
    if (course.creator.toString() !== userId) {
      console.log("Unauthorized attempt to delete course:", courseId);
      return res.status(403).json({
        message: "Unauthorized to delete this course",
        success: false,
      });
    }

    // If there's a thumbnail, delete it
    if (course.courseThumbnail) {
      const publicId = course.courseThumbnail.split("/").pop().split('.')[0];
      console.log("Deleting thumbnail with public ID:", publicId);
      await deleteMedia(publicId); // Assuming deleteMedia correctly handles media deletion
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);
    console.log("Course deleted successfully:", courseId);

    return res.status(200).json({
      message: "Course deleted successfully",
      success: true,
    });

  } catch (error) {
    console.error("Error deleting course:", error);

    res.status(500).json({
      message: "Failed to delete course",
      success: false,
    });
  }
};
const createLecture = async (req, res)=>{
  try {

    const {lectureTitle} = req.body;
    const {courseId} = req.params;

    if(!lectureTitle || !courseId){
      return res.status(400).json({
        message:"Lecture title is required",
        success:false,
      })
    }
    const lecture = await Lecture.create({lectureTitle})
    const course = await Course.findById(courseId);
    if(course){
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(201).json({
      lecture,
      message:"lecture created successfully"
    })


    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed create course",
      success: false,
    });

    
  }
}
const getLectures = async (req, res) => {
  try {
    console.log("Received request to fetch lectures for course:", req.params);

    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate({
      path: "lectures",
      select: "lectureTitle videoUrl isPreviewFree", // Include videoUrl explicitly
    });

    if (!course) {
      console.warn(`Course not found for courseId: ${courseId}`);
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    console.log(`Course found: ${courseId}, Number of lectures: ${course.lectures.length}`);

    return res.status(200).json({
      message: "Course and lectures found",
      success: true,
      lectures: course.lectures,
    });
  } catch (e) {
    console.error("Error fetching lectures:", e);

    res.status(500).json({
      message: "Failed to fetch lectures",
      success: false,
    });
  }
};
const updateLecture = async (req, res) => {
  try {
    console.log("Received request to update lecture:", req.body, req.params);

    const { lectureTitle, isPreviewFree, videoInfo } = req.body;
    const { courseId, lectureId } = req.params;

    // Find the lecture
    console.log(`Finding lecture with ID: ${lectureId}`);
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      console.log("Lecture not found!");
      return res.status(404).json({
        message: "Lecture not found",
        success: false,
      });
    }

    console.log("Lecture found:", lecture);

    // Check if a new video is being uploaded
    if (videoInfo?.videoUrl && videoInfo?.publicId) {
      if (lecture.publicId) {
        console.log("Deleting old video:", lecture.publicId);
        await deleteVideo(lecture.publicId); // Delete previous video from Cloudinary
      }

      console.log("Uploading new video...");
      const uploadResponse = await uploadMedia(videoInfo.videoUrl);
      if (uploadResponse) {
        lecture.videoUrl = uploadResponse.secure_url;
        lecture.publicId = uploadResponse.public_id;
        console.log("New video uploaded:", uploadResponse.secure_url);
      }
    }

    // Update other lecture details if provided
    if (lectureTitle) {
      lecture.lectureTitle = lectureTitle;
      console.log("Updated lectureTitle:", lectureTitle);
    }
    if (typeof isPreviewFree !== "undefined") {
      lecture.isPreviewFree = isPreviewFree;
      console.log("Updated isPreviewFree:", isPreviewFree);
    }

    // Save the updated lecture
    await lecture.save();
    console.log("Lecture updated successfully.");

    // Find the course and add lecture if missing
    console.log(`Finding course with ID: ${courseId}`);
    const course = await Course.findById(courseId);

    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
      console.log("Lecture added to course:", courseId);
    }

    return res.status(200).json({
      lecture,
      message: "Lecture updated successfully",
      success: true,
    });

  } catch (error) {
    console.error("Error updating lecture:", error);
    res.status(500).json({
      message: "Failed to update the lecture",
      success: false,
    });
  }
};

const removeLecture = async(req,res) =>{
  try{
    const {lectureId} = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if(!lecture){
      
      return res.status(404).json({
          message:"Lecture not find",
          success:false
        })
      
    }
    if(lecture.publicId){
      await deleteMedia(lecture.publicId)
    }
    await Course.updateOne(
      {
        lectures:lectureId

      },
      {
        $pull:{
          lectures:lectureId
        }
      }
    )
    return res.status(200).json({
      message:"Lecture removed successfully",
      success:true,
    })
  }catch(e){
    console.log(e);
    res.status(500).json({
      message:"Failed to remove the course",
      success:false
    })
  }
}
const getLectureById = async (req,res) =>{
  try{
    const {lectureId} = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if(!lecture){
      
      return res.status(404).json({
          message:"Lecture not find",
          success:false
        })
      
    }
    
    return res.status(200).json({
      lecture,
      success:true,
      message:"lecture found"
    })



  }catch(e){
    console.log(e);
    res.status(500).json({
      message:"Failed to get the course",
      success:false
    })
  }
}

const publishCourse = async(req,res) =>{
    try{
      const {courseId} = req.params;
      const {publish} = req.query;

      const course = await Course.findById(courseId);

      if(!course){
        return res.status(404).json({
          message:"course not found",
          success:false,
        })
      }

      course.isPublished = publish === "true";

      

      await course.save();
      const toastMsg = course.isPublished ? "publised" :"Unpublished"
      return res.status(200).json({
        message: `course is ${toastMsg}`,
        success:true,
        

      })



    } catch(e){
      return res.status(500).json({
        message:"Failed to update status"
      })

    } 
}

const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    console.log(`🔍 Attempting to fetch course with ID: ${courseId}`);

    // Attempt to retrieve the course from the database
    const course = await Course.findById(courseId);

    if (!course) {
      console.warn(`⚠️ No course found with ID: ${courseId}`);
      return res.status(404).json({
        message: "There is no course",
        success: false,
      });
    }

    console.log(`✅ Course with ID: ${courseId} found successfully`);
    return res.status(200).json({
      message: "Course found successfully",
      success: true,
      course,
    });

  } catch (error) {
    console.error("🚨 Error fetching course:", error.message || error);
    return res.status(500).json({
      message: "An error occurred while retrieving the course.",
      success: false,
    });
  }
};

const getPublishCourse = async (req, res) => {
  console.log("🚀 Fetching published courses...");

  try {
    // Fetch courses from database
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "email photoUrl",
    });

    // Check if courses exist
    if (!courses || courses.length === 0) {
      console.log("No published courses found.");
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    // Successful fetch
    console.log(`${courses.length} published courses found.`);
    return res.status(200).json({
      message: "Course found",
      success: true,
      courses,
    });
  } catch (error) {
    // Log error details
    console.error("🚨 Error fetching courses:", error.message || error);
    return res.status(500).json({
      message: "An error occurred while retrieving the published course.",
      success: false,
    });
  }
};

const searchCourse = async (req, res) => {
  try {
    // Destructure query parameters with default values
    const { query = "", categories = [], sortByPrice = "low" } = req.query;

    // Log incoming query parameters
    console.log("Incoming query parameters:", { query, categories, sortByPrice });

    // Construct search criteria for MongoDB
    const search = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ]
    };

    // Add category filter if categories are provided
    if (categories.length > 0) {
      search.category = { $in: categories }; // Use $in for array matching
    }

    // Set sorting options for price
    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1; // Ascending order
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1; // Descending order
    }

    // Log the sort options
    console.log("Sorting options:", sortOptions);

    // Fetch courses from the database
    let courses = await Course.find(search)
      .populate({ path: "creator", select: "email photoUrl" }) // Populate creator details
      .sort(sortOptions); // Sort by price

    // Log the fetched courses
    console.log("Courses found:", courses);

    // Return response
    return res.status(200).json({
      success: true,
      courses: courses || [] // Ensure it returns an empty array if no courses found
    });

  } catch (error) {
    // Log error for debugging purposes
    console.error("Error fetching courses:", error);

    // Return error response
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching courses.",
    });
  }
};




module.exports = {publishCourse, createCourse,fetchCourse,editCourse,createLecture,getLectures,removeLecture,getLectureById ,updateLecture,removeCourse,getCourseById,getPublishCourse,searchCourse };
