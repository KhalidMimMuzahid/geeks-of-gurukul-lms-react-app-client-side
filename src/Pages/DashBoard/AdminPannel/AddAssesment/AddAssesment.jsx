import React, { useEffect, useState } from "react";
import "./AddAssesment.css";
import { BiSearch } from "react-icons/bi";
import { useForm } from "react-hook-form";
import EachAssesment from "./EachAssesment/EachAssesment";

// import EachAssesment from "./EachAssesment/EachAssesment";
const AddAssesment = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [question, setQuestion] = useState([]);
  const [assessmentMainInfo, setAssessmentMainInfo] = useState({});
  const [searchParameteres, setSearchParameteres] = useState({});
  const [searchParameteresForQueries, setSearchParameteresForQueries] =
    useState({});
  const [addedQuestion, setAddedQuestion] = useState([]);
  useEffect(() => {
    // console.log("searchParameteresForQueries: ", searchParameteresForQueries);
    if (!searchParameteresForQueries) {
      // it should be not going to nex step
      // return
    }
    fetch("http://localhost:5000/get-questions", {
      headers: {
        "content-type": "application/json",
        searchparameteresforqueries: JSON.stringify(
          searchParameteresForQueries
        ),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setQuestion(data);
      });
  }, [searchParameteresForQueries]);

  // const onSubmit = (data) => {
  //   console.log("data: ", data);
  //   const { assessmentName, topicName, batchId, scheduledAt, duration } = data;
  // };
  const handleInputChange = (event) => {
    const field = event.target.name;
    // console.log("field: ", field);
    const value = event.target.value;
    // console.log(value);
    const newassesmentMainInfo = { ...assessmentMainInfo };
    newassesmentMainInfo[field] = value;
    setAssessmentMainInfo(newassesmentMainInfo);
    console.log("assessmentMainInfo: ", assessmentMainInfo);
  };
  const handleSearchQueryInputChange = (event) => {
    const field = event.target.name;
    // console.log("field: ", field);
    const value = event.target.value;
    // console.log(value);
    const newSearchParameteres = { ...searchParameteres };
    newSearchParameteres[field] = value;
    setSearchParameteres(newSearchParameteres);
    // console.log("searchParameteres: ", searchParameteres);
  };
  const handleSearchQueryFormSubmit = (event) => {
    event.preventDefault();
    setSearchParameteresForQueries({});
    setSearchParameteresForQueries(searchParameteres);
  };
  const addAssesment = (event) => {
    event.preventDefault();
    const assesment = { ...assessmentMainInfo, questions: addedQuestion };
    if (addedQuestion?.length < 10) {
      window.alert("you must have at least 10 questions");
      return;
    }
    // console.log(" assesment : ", assesment);
    fetch("http://localhost:5000/add-assesment", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(assesment),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data?.acknowledged) {
          // todo: is succesfully addded

          setAssessmentMainInfo({});
          setAddedQuestion([]);
          event.target.reset();
        } else {
          // todo: something went wrong
        }
      });
  };
  return (
    <div>
      <div className='assessment-area'>
        <div className='container'>
          <form onSubmit={addAssesment}>
            <div className=' font-poppins font-medium'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='addAssessment'>
                  <label>Assessment Name</label>
                  <input
                    type='text'
                    required
                    name='assessmentName'
                    onChange={handleInputChange}
                  />
                </div>
                <div className='addAssessment'>
                  <label>Topic</label>
                  <input
                    required
                    type='text'
                    name='topicName'
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className='col-span-12 md:col-span-6'>
                <div className='addAssessment'>
                  <label>Batch Id</label>
                  <input
                    required
                    type='text'
                    name='batchId'
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className=''>
                  <div className='addAssessment'>
                    <label>Scheduled At</label>
                    <input
                      required
                      type='text'
                      name='scheduledAt'
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className=''>
                  <div className='addAssessment'>
                    <label>Duration</label>
                    <input
                      required
                      type='number'
                      name='duration'
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* <button type='submit'>submit</button> */}
            <button
              type='submit'
              class='group relative h-12 w-full overflow-hidden rounded-lg bg-white text-lg shadow'
            >
              <div class='absolute inset-0 w-3 bg-green-400 transition-all duration-[250ms] ease-out group-hover:w-full'></div>
              <span class='relative text-black group-hover:text-white font-poppins font-medium'>
                Submit
              </span>
            </button>
          </form>
          <h4 className='text-center font-poppins font-medium my-5'>
            {addedQuestion?.length === 0
              ? "You have no question added"
              : `you have added ${addedQuestion?.length} ${
                  addedQuestion?.length > 1 ? "questions" : "question"
                }`}
          </h4>

          <form onSubmit={handleSearchQueryFormSubmit} id='search-parameteres'>
            <div className='font-poppins font-medium'>
              <div className='col-md-5'>
                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center'>
                  <div className='col-md-6'>
                    <div className='search-area'>
                      <input
                        type='text'
                        name='questionName'
                        placeholder='question'
                        onChange={handleSearchQueryInputChange}
                      />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='search-area'>
                      <input
                        type='text'
                        placeholder='Topic'
                        name='topicName'
                        onChange={handleSearchQueryInputChange}
                      />
                    </div>
                  </div>
                  <div className='col-md-4'>
                    <div className='search-area'>
                      <select
                        name='difficultyLevel'
                        id=''
                        defaultValue='any'
                        onChange={handleSearchQueryInputChange}
                      >
                        <option value='any' disabled>
                          Difficulty
                        </option>
                        <option value='Easy'>Easy</option>
                        <option value='Medium'>Medium</option>
                        <option value='Hard'>Hard</option>
                      </select>
                    </div>
                  </div>
                  <div className='col-md-4'>
                  <div className='search-area'>
                    <button
                      type='reset'
                      onClick={() => setSearchParameteres({})}
                      class='group relative h-12 w-32 overflow-hidden rounded-lg bg-white text-lg shadow'
                    >
                      <div class='absolute inset-0 w-3 bg-red-400 transition-all duration-[250ms] ease-out group-hover:w-full'></div>
                      <span class='relative text-black group-hover:text-white'>
                        Clear
                      </span>
                    </button>
                  </div>
                </div>
                <div className='col-md-4'>
                <button type="submit" className="font-poppins flex bg-green-500 px-4 py-3 text-white rounded-lg hover:bg-green-400 transition-[500ms]">
                      <BiSearch size={24}></BiSearch><span>Search</span>
                    </button>
                    
                </div>
                </div>
              </div>
            </div>
          </form>
          {/* <div className="row">
            <div className="col-md-12">
              <div className="display-show">
                <div className="row">
                  <div className="col-md-2"></div>
                  <div className="col-md-10">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="part-question">
                          <div className="title-part">
                            <h2>Question Names</h2>
                          </div>
                          <h3>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Quod asperiores sit aperiam officiis laborum.{" "}
                          </h3>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="part-question">
                          <div className="title-part">
                            <h2>Topic </h2>
                          </div>
                          <h3>SC</h3>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="part-question">
                          <div className="title-part">
                            <h2>Difficulty</h2>
                          </div>
                          <h3>Easy</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* <table className='table table-bordered'>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Question</th>
                <th>topic</th>
                <th>difficulty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {question?.map((eachQues, i) => (
                <EachAssesment
                  eachQues={eachQues}
                  key={eachQues?._id}
                  i={i}
                  addedQuestion={addedQuestion}
                  setAddedQuestion={setAddedQuestion}
                />
              ))}
            </tbody>
          </table> */}
          {/* New Table */}
          <section class='antialiased bg-white text-gray-600 px-4 my-10'>
            <div class='flex flex-col justify-center h-full'>
              {/* <!-- Table --> */}
              <div class='w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200'>
                <header class='px-5 py-4 border-b border-gray-100'>
                  <h2 class='font-semibold text-gray-800'>Questions</h2>
                </header>
                <div class='p-3'>
                  <div class='overflow-x-auto'>
                    <table class='table-auto w-full'>
                      <thead class='text-xs font-semibold uppercase text-gray-400 bg-gray-50'>
                        <tr>
                          <th class='p-2 whitespace-nowrap'>
                            <div class='font-semibold text-left'>SL No.</div>
                          </th>
                          <th class='p-2 whitespace-nowrap'>
                            <div class='font-semibold text-left'>Questions</div>
                          </th>
                          <th class='p-2 whitespace-nowrap'>
                            <div class='font-semibold text-left'>Topic</div>
                          </th>
                          <th class='p-2 whitespace-nowrap'>
                            <div class='font-semibold text-center'>
                              Difficulty
                            </div>
                          </th>
                          <th class='p-2 whitespace-nowrap'>
                            <div class='font-semibold text-center'>Action</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody class='text-sm divide-y divide-gray-100'>
                        {question?.map((eachQues, i) => (
                          <EachAssesment
                            eachQues={eachQues}
                            key={eachQues?._id}
                            i={i}
                            addedQuestion={addedQuestion}
                            setAddedQuestion={setAddedQuestion}
                          />
                          // sample table row design pay attention khaled vai
                          //                       <tr>
                          //   <td class='p-2 whitespace-nowrap'>
                          //     <div class='flex items-center'>
                          //       <div class='w-10 h-10 flex-shrink-0 mr-2 sm:mr-3'>
                          //         <img
                          //           class='rounded-full'
                          //           src='https://raw.githubusercontent.com/cruip/vuejs-admin-dashboard-template/main/src/images/user-36-07.jpg'
                          //           width='40'
                          //           height='40'
                          //           alt='Mirko Fisuk'
                          //         />
                          //       </div>
                          //       <div class='font-medium text-gray-800'>Mirko Fisuk</div>
                          //     </div>
                          //   </td>
                          //   <td class='p-2 whitespace-nowrap'>
                          //     <div class='text-left'>mirkofisuk@gmail.com</div>
                          //   </td>
                          //   <td class='p-2 whitespace-nowrap'>
                          //     <div class='text-left font-medium text-green-500'>$2,996.00</div>
                          //   </td>
                          //   <td class='p-2 whitespace-nowrap'>
                          //     <div class='text-lg text-center'>??</div>
                          //   </td>
                          //   <td class='p-2 whitespace-nowrap'>
                          //     <div class='text-lg text-center'>??</div>
                          //   </td>
                          // </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AddAssesment;