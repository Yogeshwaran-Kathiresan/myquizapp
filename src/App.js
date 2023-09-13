import React, { useEffect, useState } from 'react';
import './App.css';


function App() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [showQuestion, setShowQuestion] = useState(true);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 1) {
        setTimer(timer - 1);
      } else {
        clearInterval(countdown);
        handleNextQuestion();
        setTimer(10);
      }
    }, 1000);

    return () => {
      clearInterval(countdown);
    };
  }, [timer]);

  useEffect(() => {
    fetch(`https://opentdb.com/api.php?amount=5`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.results.map((value) => {
          return { ...value, options: [value.correct_answer, ...value.incorrect_answers] };
        });
        setAllQuestions(options);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
      });
  }, []);

  const handleChange = (event) => {
    setCurrentAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    if (allQuestions.length - 1 === currentQuestion) {
      if (currentAnswer === allQuestions[currentQuestion].correct_answer) {
        setScore(score + 1);
      }
      setAssessmentCompleted(true);
      return;
    }
    if (currentAnswer === allQuestions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
    setTimer(10);
  };

  return (
    <div className='container'>
      {showQuestion && !assessmentCompleted ? (
        <>
        <div className='init-box'>
        <h1> My Quiz Application</h1>
        <button onClick={() => setShowQuestion(false)}>Take Quiz</button>
        </div>
        </>
      ) : (
        <>
          {!assessmentCompleted ? (
            <>
            <div className='quiz-box'>
              <div className='timer'> Time remaining for this question : <strong>{timer}</strong> seconds</div>
              {allQuestions.length > 0 && (
                <>
                <div className='question-box'>
                  <p className='question-number'><strong>Question {currentQuestion + 1}</strong>:</p>
                  <p>{allQuestions[currentQuestion].question}</p>
                  {allQuestions[currentQuestion].options.map((value, index) => (
                    <div key={index} className='radio-buttons'>
                      <input
                        id='option'
                        type="radio"
                        value={value}
                        onChange={handleChange}
                        checked={value === currentAnswer}
                      />
                      <label for='option'>{value}</label>
                    </div>
                  ))}
                  </div>
                </>
              )}
              <button onClick={handleNextQuestion} className='next-question'>Next Question</button>
              </div>
            </>
          ) : (
            <div className='init-box'>
              <h2>Assessment Completed</h2>
              <p>Your final score is: <strong>{score}</strong> out of <strong> {allQuestions.length}</strong></p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
