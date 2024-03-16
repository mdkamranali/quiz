import React,{Fragment,useState,useEffect} from "react";
import { Helmet } from "react-helmet";
import questions from '../../questions.json';
import isEmpty from "../../utils/is-empty";
import { useNavigate} from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';

const Play = () => {
    const navigate = useNavigate();
    // const history = useHistory();
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [nextQuestion, setNextQuestion] = useState({});
    const [previousQuestion, setPreviousQuestion] = useState({});
    const [answer, setAnswer] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [numberOfAnsweredQuestions, setNumberOfAnsweredQuestions] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [hints, setHints] = useState(5);
    const [fiftyFifty, setFiftyFifty] = useState(2);
    const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
    const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
    const [previousButtonDisabled, setPreviousButtonDisabled] = useState(true);
    const [previousRandomNumbers, setPreviousRandomNumbers] = useState([]);
    const [time, setTime] = useState({});
    const [reviewedQuestions, setReviewedQuestions] = useState([]);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [visitedQuestions, setVisitedQuestions] = useState([]);
    // const correctSound = useRef(null);
    // const wrongSound = useRef(null);
    // const buttonSoundRef = useRef(null);
    let interval = null;
    useEffect(() => {
        setVisitedQuestions(Array.from({ length: numberOfQuestions }, (_, index) => index));
    }, [numberOfQuestions]);
    useEffect(() => {
        displayQuestions();
        startTimer();

        // Cleanup function
        return () => {
            clearInterval(interval);
        };
    }, []);

    const displayQuestions = () => {
        let currentQuestion, nextQuestion, previousQuestion;
        if (!isEmpty(questions)) {
            currentQuestion = questions[currentQuestionIndex];
            nextQuestion = questions[currentQuestionIndex + 1];
            previousQuestion = questions[currentQuestionIndex - 1];
            const answer = currentQuestion.answer;
            setCurrentQuestion(currentQuestion);
            setNextQuestion(nextQuestion);
            setPreviousQuestion(previousQuestion);
            setAnswer(answer);
            setNumberOfQuestions(questions.length);
            setPreviousRandomNumbers([]);
            showOptions();
            handleDisableButton();
        }
    };

    const handleOptionClick = (e) => {

        setAnsweredQuestions([...answeredQuestions, currentQuestionIndex]);
        unmarkAsReview(currentQuestionIndex);
        // setVisitedQuestions(visitedQuestions.filter(q => q !== currentQuestionIndex));
        if (e.target.innerHTML.toLowerCase() === answer.toLowerCase()) {
            // correctSound.current.play();
            correctAnswer();
        } else {
            // wrongSound.current.play();
            wrongAnswer();
        }
    };
    const handleNextButtonClick = () => {
        // playButtonSound();
        if (currentQuestionIndex<14) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            displayQuestions();
        }
    };

    const handlePreviousButtonClick = () => {
        // playButtonSound();
        if (currentQuestionIndex>0) {
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
            displayQuestions();
        }
    };

    const handleQuitButtonClick = () => {
        // playButtonSound();
        if (window.confirm('Are you sure you want to quit?')) {
            const playerStats = {
                score: score,
                numberOfQuestions: numberOfQuestions,
                numberOfAnsweredQuestions: correctAnswers + wrongAnswers,
                correctAnswers: correctAnswers,
                wrongAnswers: wrongAnswers,
                fiftyFiftyUsed: 2 - fiftyFifty,
                hintsUsed: 5 - hints
            };
            setTimeout(() => {
                // history.push('/play/quizSummary', playerStats);
                navigate('/play/quizSummary',{ state: playerStats });
            }, 1000);
        }
    };

    const handleButtonClick = (e) => {
        switch (e.target.id) {
            case 'next-button':
                handleNextButtonClick();
                break;
            case 'previous-button':
                handlePreviousButtonClick();
                break;
            case 'quit-button':
                handleQuitButtonClick();
                break;
            default:
                break;
        }
    };

    const playButtonSound = () => {
        // buttonSoundRef.current.play();
    };

    const correctAnswer = () => {
        // M.toast({
        //     html: 'Correct Answer!',
        //     classes: 'toast-valid',
        //     displayLength: 1500
        // });
        setScore(score + 1);
        setCorrectAnswers(correctAnswers + 1);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setNumberOfAnsweredQuestions(numberOfAnsweredQuestions + 1);
        if (nextQuestion === undefined) {
            endGame();
        } else {
            displayQuestions();
        }
    };

    const wrongAnswer = () => {
        // navigator.vibrate(1000);
        // M.toast({
        //     html: 'Wrong Answer!',
        //     classes: 'toast-invalid',
        //     displayLength: 1500
        // });
        setWrongAnswers(wrongAnswers + 1);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setNumberOfAnsweredQuestions(numberOfAnsweredQuestions + 1);
        if (currentQuestionIndex === 15) {
            endGame();
        } else {
            displayQuestions();
        }
    };

    const showOptions = () => {
        const options = Array.from(document.querySelectorAll('.option'));
        options.forEach(option => {
            option.style.visibility = 'visible';
        });
        setUsedFiftyFifty(false);
    };

    const handleHints = () => {
        if (hints > 0) {
            const options = document.querySelectorAll('.option');
            let indexOfAnswer;
            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === currentQuestion.answer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });
    
            let countHidden = 0;
            for (let index = 0; index < options.length; index++) {
                if (index !== indexOfAnswer && options[index].style.visibility !== 'hidden') {
                    options[index].style.visibility = 'hidden';
                    countHidden++;
                    setHints(prevHints => prevHints - 1);
                    break; // Exit loop after hiding one incorrect option
                }
            }
        }
    };
    
    
    const handleFiftyFifty = () => {
        if (fiftyFifty > 0 && !usedFiftyFifty) {
            const options = document.querySelectorAll('.option');
            let count = 0;
    
            // Loop through the options and hide the first two incorrect options found
            options.forEach(option => {
                if (option.innerHTML.toLowerCase() !== answer.toLowerCase() && count < 2) {
                    option.style.visibility = 'hidden';
                    count++;
                }
            });
    
            // Update state variables
            setFiftyFifty(prevFiftyFifty => prevFiftyFifty - 1);
            setUsedFiftyFifty(true);
        }
    };
    
    
    const startTimer = () => {
        const countDownTime = Date.now() + 180000
        const interval = setInterval(() => {
            const now = Date.now();
            const distance = countDownTime - now;
    
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
            if (distance < 0) {
                clearInterval(interval);
                setTime({
                    minutes: 0,
                    seconds: 0
                });
                endGame(); // Call endGame() when time is up
            } else {
                setTime({
                    minutes: minutes,
                    seconds: seconds
                });
            }
        }, 1000);
    };
    
    
    const handleDisableButton = () => {
        
        setPreviousButtonDisabled(currentQuestionIndex === 0);
        setNextButtonDisabled(currentQuestionIndex + 1 === numberOfQuestions);
    };
    
    const markAsReview = (questionNumber) => {
        if (!reviewedQuestions.includes(questionNumber)) {
            setReviewedQuestions([...reviewedQuestions, questionNumber]);
        }
    };

    const unmarkAsReview = (questionNumber) => {
        if (reviewedQuestions.includes(questionNumber)) {
            setReviewedQuestions(reviewedQuestions.filter(q => q !== questionNumber));
        }
    };

    const endGame = () => {
        alert('Quiz has ended!');
        const playerStats = {
            score: score,
            numberOfQuestions: numberOfQuestions,
            numberOfAnsweredQuestions: correctAnswers + wrongAnswers,
            correctAnswers: correctAnswers,
            wrongAnswers: wrongAnswers,
            fiftyFiftyUsed: 2 - fiftyFifty,
            hintsUsed: 5 - hints
        };
        setTimeout(() => {
            // history.push('/play/quizSummary', playerStats);
            navigate('/play/quizSummary',{ state: playerStats });
        }, 1000);
    };
    
    const goToQuestion = (questionNumber) => {
        setCurrentQuestionIndex(questionNumber);
        displayQuestions();
    };


    return (
        <div>
        <title>Quiz Page</title>
            {/* <audio ref={correctSound} src={correctNotification}></audio>
            <audio ref={wrongSound} src={wrongNotification}></audio>
            <audio ref={buttonSoundRef} src={buttonSound}></audio> */}
        <div className="questions">
            <h2>Quiz Mode</h2>
            <div className="question-numbers-container">
            {[...Array(15)].map((_, index) => (
                <div key={index} className="question-number">
                  <button
    className={'question-number-box ' +
        (reviewedQuestions.includes(index) ? 'marked-review ' : '') +
        (answeredQuestions.includes(index) ? 'answered ' : '') +
        (currentQuestionIndex === index ? 'highlight' : '')
    }
    onClick={() => goToQuestion(index)}
    disabled={answeredQuestions.includes(index)}
>
    {index + 1}
</button>
                </div>
            ))}
        </div>
            <div className="lifeline-container">
                <p>
                    <span onClick={handleFiftyFifty} className="mdi mdi-set-center mdi-24px lifeline-icon">
                        <span className="lifeline"><SwapVertRoundedIcon/><strong className="yyy">: {fiftyFifty}</strong></span>
                    </span>
                </p>
                <p>
                    <span onClick={handleHints} className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon">
                        <span className="hint"><LightbulbIcon/>  <strong className="yyy">: {hints}</strong></span>
                    </span>
                </p>
            </div>
            <div className="timer-container">
                <p>
                    <span className="new">{currentQuestionIndex + 1} of {numberOfQuestions}</span>
                    <span className="time">
                    <AccessTimeIcon /> <strong className="yyy">{time.minutes}:{time.seconds}</strong>
                    </span>
                </p>
            </div>
            <h2>{currentQuestion.question}</h2>
            <div className="options-container">
                <p onClick={handleOptionClick} className="option">{currentQuestion.optionA}</p>
                <p onClick={handleOptionClick} className="option">{currentQuestion.optionB}</p>
            </div>
            <div className="options-container">
                <p onClick={handleOptionClick} className="option">{currentQuestion.optionC}</p>
                <p onClick={handleOptionClick} className="option">{currentQuestion.optionD}</p>
            </div>

            <div className="button-container">
                <button
                    className="previous"
                    id="previous-button"
                    onClick={handleButtonClick}>
                    Previous
                </button>
                <button
                    className="next"
                    id="next-button"
                    onClick={handleButtonClick}>
                    Next
                </button>
                <button className="quit" id="quit-button" onClick={handleButtonClick}>Quit</button>
                <button
                        className="next2"
                        id="review-button"
                        onClick={() => {
                            if (reviewedQuestions.includes(currentQuestionIndex)) {
                                unmarkAsReview(currentQuestionIndex);
                            } else {
                                markAsReview(currentQuestionIndex);
                            }
                        }}
                    >
                        {reviewedQuestions.includes(currentQuestionIndex) ? "Unmark as Review" : "Mark as Review"}
                    </button>
                        <div className="box1">
                        Not Answered
                        </div>
                        <div className="box2">
                            Marked as Review
                        </div>
                        <div className="box3">
                            Answered
                        </div>
                    
            </div>
        </div>
    </div>
    );
}

export default Play;

//         <Fragment>
//              <Helmet><title>Quiz Page</title></Helmet>
//              <div className="questions">
//                 <h2>Quiz Mode</h2>
//                 <div className="lifeline-container">
//                     <p>
//                         <span className="mdi mdi-set-center mdi-24px lifeline-icon"></span> <span className="lifeline">2</span>
//                     </p>
//                     <p>
//                         <span className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon"></span>
//                         <div className="hint">5</div>
//                     </p>
//                 </div>
//              <div>
//              <p>
//                 <span>1 of 15</span>
//                <span className="timer">2:15</span><span className="mdi mdi-clock-outline"></span>
//              </p>
//              </div>
//              <h3>Google was founded in which year</h3>
//              <div className="options-container">
//                 <p className="option">1997</p>
//                 <p className="option">1998</p>
//                 </div>
//                 <div className="options-container">
//                 <p className="option">1997</p>
//                 <p className="option">1998</p>
//                 </div>
//                 <div className="button-container">
//                     <button className="previous">Previous</button>
//                     <button className="next">Next</button>
//                     <button className="quit">Quit</button>
//                 </div>
// </div>
//             </Fragment>
