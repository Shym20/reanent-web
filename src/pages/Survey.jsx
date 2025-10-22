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
  const contact = location.state?.contact || ""; // ✅ unified field (email or mobile)

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/constants?key=7089887460`);
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
    let updatedAnswers;

    if (option === "Other") {
      setCustomAnswer("");
      return;
    } else {
      updatedAnswers = [
        ...answers.filter((a) => a.question !== questionObj.question),
        { question: questionObj.question, answer: option },
      ];
      setAnswers(updatedAnswers);
    }

    goNext(updatedAnswers);
  };

  const handleCustomSubmit = () => {
    const questionObj = questions[currentQuestion];
    if (customAnswer.trim()) {
      const updatedAnswers = [
        ...answers.filter((a) => a.question !== questionObj.question),
        { question: questionObj.question, answer: customAnswer.trim() },
      ];
      setAnswers(updatedAnswers);
      goNext(updatedAnswers);
    }
  };

  const goNext = async (updatedAnswers = answers) => {
  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1);
  } else {
    try {
      const uniqueFactor = contact; // ✅ email or mobile directly
      const res = await fetch(
        `${API_BASE_URL}api/user/survey/submit-answers/${uniqueFactor}`,
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


  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading survey...</div>;
  }

  if (questions.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">No survey questions found</div>;
  }

  return (
    <div
      style={{ backgroundImage: `url(${loginBg})` }}
      className="flex justify-center bg-cover bg-center items-center min-h-screen"
    >
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">
          {questions[currentQuestion].question}
        </h2>

        <div className="space-y-3">
          {questions[currentQuestion].options === null ? (
            <div className="space-y-3">
              <input
                type="text"
                value={customAnswer}
                onChange={(e) => setCustomAnswer(e.target.value)}
                placeholder="Please write your answer..."
                className="w-full p-3 rounded-xl border"
              />
              <button
                onClick={handleCustomSubmit}
                className="w-full p-3 rounded-xl bg-[#033E4A] text-white hover:bg-[#055564] transition"
              >
                Submit
              </button>
            </div>
          ) : (
            <>
              {answers.find((a) => a.question === questions[currentQuestion].question)?.answer === "" ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={customAnswer}
                    onChange={(e) => setCustomAnswer(e.target.value)}
                    placeholder="Please specify..."
                    className="w-full p-3 rounded-xl border"
                  />
                  <button
                    onClick={handleCustomSubmit}
                    className="w-full p-3 rounded-xl bg-[#033E4A] text-white hover:bg-[#055564] transition"
                  >
                    Submit
                  </button>
                </div>
              ) : (
                questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-3 rounded-xl bg-gray-100 hover:bg-[#033E4A] hover:text-white transition"
                  >
                    {option}
                  </button>
                ))
              )}
            </>
          )}
        </div>

        <p className="text-sm text-gray-400 mt-4">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>
    </div>
  );
}
