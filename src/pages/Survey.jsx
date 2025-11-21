import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import loginBg from "../assets/images/login-bg.png";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Survey() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [customAnswer, setCustomAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const contact = location.state?.contact || ""; // email or mobile

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/constants?key=7089887460`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });
        const data = await res.json();
        if (data?.status === 200) {
          const surveyData = data.data.survey_questions;

          const formattedQuestions = Object.keys(surveyData).map((key, index) => ({
            id: index + 1,
            question: surveyData[key].question,
            options: surveyData[key].enum,
          }));

          setQuestions(formattedQuestions);
        }
      } catch (error) {
        console.error("Error fetching survey questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (option) => {
    const questionObj = questions[currentQuestion];
    const updatedAnswers = [
      ...answers.filter((a) => a.question !== questionObj.question),
      { question: questionObj.question, answer: option },
    ];
    setAnswers(updatedAnswers);
  };

  const handleCustomSubmit = () => {
    const questionObj = questions[currentQuestion];
    if (customAnswer.trim()) {
      const updatedAnswers = [
        ...answers.filter((a) => a.question !== questionObj.question),
        { question: questionObj.question, answer: customAnswer.trim() },
      ];
      setAnswers(updatedAnswers);
    }
  }; 

  const goNext = async () => {
  const questionObj = questions[currentQuestion];

  // --- FIX: Capture latest custom answer before submission ---
  let updatedAnswers = [...answers];
  if (questionObj.options === null && customAnswer.trim()) {
    updatedAnswers = [
      ...answers.filter((a) => a.question !== questionObj.question),
      { question: questionObj.question, answer: customAnswer.trim() },
    ];
    setAnswers(updatedAnswers);
  }

  // --- Navigation or Submission ---
  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1);
    setCustomAnswer("");
  } else {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/user/survey/submit-answers/${contact}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: updatedAnswers }), 
        }
      );

      const result = await res.json();
      console.log("Survey submit response:", result);
      toast.success("Thanks for your time :)");

      if (result?.status === "success") {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  }
};


  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCustomAnswer("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading survey...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No survey questions found
      </div>
    );
  }

  const questionObj = questions[currentQuestion];
  const currentAnswer =
    answers.find((a) => a.question === questionObj.question)?.answer || "";

  return (
    <div
      style={{ backgroundImage: `url(${loginBg})` }}
      className="flex justify-center bg-cover bg-center items-center min-h-screen"
    >
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">
          {questionObj.question}
        </h2>

        <div className="space-y-3">
          {questionObj.options === null ? (
            <>
              <input
                type="text"
                value={customAnswer || currentAnswer}
                onChange={(e) => setCustomAnswer(e.target.value)}
                placeholder="Please write your answer..."
                className="w-full p-3 rounded-xl border"
              />
            </>
          ) : (
            questionObj.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full p-3 rounded-xl transition ${
                  currentAnswer === option
                    ? "bg-[#033E4A] text-white"
                    : "bg-gray-100 hover:bg-[#033E4A] hover:text-white"
                }`}
              >
                {option}
              </button>
            ))
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={goBack}
            disabled={currentQuestion === 0}
            className={`px-5 py-2 rounded-xl font-medium ${
              currentQuestion === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Back
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={goNext}
              disabled={!currentAnswer && !customAnswer.trim()}
              className={`px-5 py-2 rounded-xl font-medium ${
                !currentAnswer && !customAnswer.trim()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#033E4A] text-white hover:bg-[#055564]"
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={!currentAnswer && !customAnswer.trim()}
              className={`px-5 py-2 rounded-xl font-medium ${
                !currentAnswer && !customAnswer.trim()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Submit
            </button>
          )}
        </div>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>
    </div>
  );
}
