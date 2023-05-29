import { useQuery } from "@tanstack/react-query";
import React, { useState, useContext, useEffect } from "react";
import { BsFillCaretRightFill } from "react-icons/bs";
import { AiFillCheckCircle } from "react-icons/ai";
import moment from "moment/moment";
import { AuthContext } from "../../../../../contexts/UserProvider/UserProvider";
import { toast } from "react-hot-toast";
import { uploadFile } from "react-s3";
import { useForm } from "react-hook-form";

window.Buffer = window.Buffer || require("buffer").Buffer;
const config = {
  bucketName: "all-files-for-gog",
  dirName: "assets/any-types",
  region: "ap-south-1",
  accessKeyId: process.env.REACT_APP_S3AccessKeyId,
  secretAccessKey: process.env.REACT_APP_S3SecretAccessKey,
};

const EachExercise = ({
  exercise: exerciseTemp,
  selected,
  selectedModuleLectureList,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // console.log("selected: ", selected);
  // console.log("exercise: ", exerciseTemp);
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [exerciseResponse, setExerciseResponse] = useState("");
  const { data: exercise, isLoading } = useQuery({
    queryKey: [exerciseTemp?.exercise_id],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/exerciseby_id?_id=${exerciseTemp?.exercise_id}`
      );
      const data = await res.json();
      return data;
    },
  });

  const lecture = selectedModuleLectureList.find(
    (lecture) => lecture?._id === selected?.lecture_id
  );
  console.log("selected lecture: ", selectedModuleLectureList);

  useEffect(() => {
    const query = {
      lecture_id: selected?.lecture_id,
      assignment_id: selected?.assignment_id,
      exercise_id: exerciseTemp?.exercise_id,
      studentEmail: user?.email,
    };
    fetch(`http://localhost:5000/exercise-response`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        query: JSON.stringify(query),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.success) {
          const data = result?.data;
          // console.log("Exercise Response: ", data)
          setExerciseResponse(data);
        } else {
          setExerciseResponse({});
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [exerciseTemp?.exercise_id]);

  const handleClick = () => {
    const justNow = moment().format();
    setIsOpen(!isOpen);
    if (!isOpen) {
      const exerciseData = {
        isSubmitted: false,
        status: "visited",
        program: {
          program_id: lecture?.program?.program_id,
          programName: lecture?.program?.programName,
        },
        course: {
          course_id: lecture?.course?.course_id,
          courseName: lecture?.course?.courseName,
        },
        batch: {
          batch_id: lecture?.batch?.batch_id,
          batchName: lecture?.batch?.batchName,
        },
        lecture: {
          lecture_id: selected?.lecture_id,
          lectureName: lecture?.lectureName,
        },
        module: {
          module_id: lecture?.module?.module_id,
          moduleName: lecture?.module?.moduleName,
        },
        assignment: {
          assignment_id: selected?.assignment_id,
          assignmentName: selected?.assignmentName,
        },
        exercise: {
          exercise_id: exerciseTemp?.exercise_id,
          exerciseName: exerciseTemp?.exerciseName,
        },
        submissionDetails: {
          studentEmail: user?.email,
          startedAt: justNow,
          finishedAt: "",
        },
      };
      fetch("http://localhost:5000/exercise-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exerciseData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("data for exercises", data);
          if (data?.success) {
            // to do
            setExerciseResponse(exerciseData);
          } // Log the response from the server
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const onSubmit = async (data) => {
    const justNow = moment().format();
    let link = "";
    setLoading(true);
    if (exercise.submissionType === "link") {
      // console.log("Link: ", data.link);
      link = data.link;
    } else {
      console.log("File: ", data?.link[0]);
      const file = data?.link[0];
      const fileData = await uploadFile(file, config);
      if (fileData?.location) {
        link = fileData?.location;
      } else {
        toast.error("attachment could not be uploaded");
      }
    }
    const responseData = {
      isSubmitted: true,
      status: "completed",
      link: link,
    };
    console.log("responseData: ", responseData);
    setLoading(false);
  };

  // console.log("exercise: ", exercise);
  if (isLoading) {
    return (
      <div>
        <downloading className="">downloading</downloading>
      </div>
    );
  }
  console.log(exerciseResponse);
  return (
    <div className="flex flex-col w-full px-4 py-2 my-1 text-left border border-gray-200 bg-green-50 rounded-md">
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center justify-between w-full"
      >
        <p className="text-green-600 flex items-center gap-4">
          {exercise?.exerciseName}
          {exerciseResponse?.status === "visited" && (
            <AiFillCheckCircle></AiFillCheckCircle>
          )}
        </p>
        <BsFillCaretRightFill
          className="ease-in-out duration-300"
          style={isOpen && { color: "green", transform: "rotate(90deg)" }}
        />
      </button>

      {isOpen && (
        <div className="bg-white p-3 mt-2 rounded-md text-sm">
          <p className="w-full">
            <span className="font-semibold">Topic: </span>
            {exercise.topic}
          </p>
          <p className="mt-3 w-full">
            <span className="font-semibold">Sub topic: </span>
            {exercise.subTopic}
          </p>
          <p className="mt-3 w-full">
            <span className="font-semibold">Exercise type: </span>
            {exercise.type}
          </p>
          <div className="mt-3 w-full">
            <p className="font-semibold">Instructions: </p>
            <p>{exercise.additionals.instructions}</p>
          </div>
          <div className="mt-3 w-full">
            <p className="font-semibold">Files:</p>
            <a
              target="_blank"
              href={exercise.additionals.files}
              className="text-green-400 hover:text-green-500"
            >
              Click here {">>"}
            </a>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-3 w-full">
              <p className="font-semibold mb-2">Submission:</p>
              {exercise.submissionType === "link" ? (
                <input
                  type="url"
                  id="link"
                  name="link"
                  className="rounded w-full font-xs"
                  placeholder="Enter submission file link"
                  {...register("link", {
                    required: "Link is required",
                  })}
                  aria-invalid={errors.link ? "true" : "false"}
                />
              ) : (
                <input
                  type="file"
                  id="link"
                  name="link"
                  className="rounded w-full border"
                  {...register("link", {
                    required: "File is required",
                  })}
                  aria-invalid={errors.link ? "true" : "false"}
                />
              )}
              {errors.link && (
                <p
                  className="text-red-500 font-poppins font-medium"
                  role="alert"
                >
                  {errors.link?.message}
                </p>
              )}
            </div>
            <button
              className={`mt-3 w-full p-3 ${
                loading ? "bg-gray-300" : "bg-green-300 hover:bg-green-400"
              } rounded ${loading && "pointer-events-none"}`}
              type="submit"
            >
              {loading ? "Loading" : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EachExercise;
