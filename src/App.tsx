import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type Screen = "intro" | "quiz" | "result";

type Question = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

const questions: Question[] = [
  {
    question: "소셜벤처가 함께 추구하는 두 가지 가치는 무엇인가요?",
    options: ["재미와 인기", "사회적 가치와 경제적 가치", "속도와 규모", "광고와 홍보"],
    answerIndex: 1,
    explanation:
      "소셜벤처는 사회문제 해결이라는 사회적 가치와 지속 가능한 수익이라는 경제적 가치를 함께 추구합니다.",
  },
  {
    question: "소셜벤처가 단순 기부나 봉사와 다른 가장 큰 이유는 무엇인가요?",
    options: [
      "반드시 대기업만 할 수 있기 때문",
      "수익모델을 통해 지속 가능하게 운영되기 때문",
      "사회문제를 다루지 않기 때문",
      "정부 예산만으로 운영되기 때문",
    ],
    answerIndex: 1,
    explanation:
      "소셜벤처는 좋은 의도에서 끝나는 것이 아니라, 수익구조를 통해 문제 해결을 오래 지속하려는 방식입니다.",
  },
  {
    question: "소셜벤처의 3대 핵심요소가 아닌 것은 무엇인가요?",
    options: ["사회적 가치", "수익성", "혁신성", "유명세"],
    answerIndex: 3,
    explanation: "소셜벤처의 핵심은 사회적 가치, 수익성, 혁신성입니다.",
  },
  {
    question: "‘사회적 가치’에 대한 설명으로 가장 알맞은 것은 무엇인가요?",
    options: [
      "해결하려는 사회문제가 명확해야 한다",
      "무조건 가격이 저렴해야 한다",
      "광고를 많이 해야 한다",
      "빠르게 유행을 따라가야 한다",
    ],
    answerIndex: 0,
    explanation:
      "사회적 가치는 환경, 고령화, 교육격차, 취약계층 문제처럼 해결하려는 문제가 분명할 때 만들어집니다.",
  },
  {
    question: "‘수익성’이 소셜벤처에서 중요한 이유는 무엇인가요?",
    options: [
      "돈만 많이 벌기 위해서",
      "지속적으로 문제를 해결하기 위해서",
      "사회문제를 피하기 위해서",
      "경쟁사를 없애기 위해서",
    ],
    answerIndex: 1,
    explanation: "수익구조가 있어야 서비스가 오래 운영되고, 사회문제 해결도 지속될 수 있습니다.",
  },
  {
    question: "‘혁신성’에 대한 설명으로 가장 적절한 것은 무엇인가요?",
    options: [
      "기존 방식만 그대로 따라 하는 것",
      "새로운 기술, 서비스, 모델로 문제에 접근하는 것",
      "최대한 많은 상품을 파는 것",
      "단순히 예쁜 디자인을 만드는 것",
    ],
    answerIndex: 1,
    explanation:
      "혁신성은 기존 해결 방식이 아닌 새로운 기술, 서비스, 비즈니스 모델로 문제를 해결하는 능력입니다.",
  },
  {
    question: "다음 중 환경형 소셜벤처에 가장 가까운 예시는 무엇인가요?",
    options: [
      "폐기물을 줄이고 리사이클링 솔루션을 제공하는 기업",
      "단순히 간식을 판매하는 매점",
      "게임 아이템을 판매하는 사이트",
      "유명인의 굿즈를 판매하는 쇼핑몰",
    ],
    answerIndex: 0,
    explanation:
      "환경형 소셜벤처는 폐기물 절감, 친환경 소재, 리사이클링 등 환경문제 해결을 목표로 합니다.",
  },
  {
    question: "다음 중 교육형 소셜벤처에 가장 가까운 예시는 무엇인가요?",
    options: [
      "교육격차를 줄이기 위한 학습 서비스를 제공하는 기업",
      "광고 영상을 많이 만드는 기업",
      "운동화를 판매하는 쇼핑몰",
      "배달 속도만 높이는 서비스",
    ],
    answerIndex: 0,
    explanation:
      "교육형 소셜벤처는 저소득층, 소외지역, 교육 소외계층 등의 교육격차를 줄이는 데 집중합니다.",
  },
  {
    question: "소셜벤처가 최근 더 중요해지는 배경으로 알맞은 것은 무엇인가요?",
    options: [
      "ESG와 가치 중심 소비, 사회문제 심화가 커지고 있기 때문",
      "모든 기업이 이익을 포기해야 하기 때문",
      "기술 창업이 완전히 사라졌기 때문",
      "사회문제가 더 이상 없기 때문",
    ],
    answerIndex: 0,
    explanation:
      "ESG, 기후위기, 고령화, 지역소멸, 교육격차 등으로 인해 지속 가능한 문제 해결형 비즈니스가 중요해지고 있습니다.",
  },
  {
    question: "다음 중 소셜벤처 아이디어로 가장 적절한 것은 무엇인가요?",
    options: [
      "단순히 유행하는 밈만 모아 보여주는 사이트",
      "폐현수막을 업사이클링해 제품을 만들고, 수익으로 지역 환경교육을 운영하는 서비스",
      "아무 문제의식 없이 랜덤 상품만 판매하는 쇼핑몰",
      "가격만 비싼 한정판 굿즈 판매 서비스",
    ],
    answerIndex: 1,
    explanation:
      "사회문제 해결, 수익구조, 혁신적 접근이 함께 들어가 있으므로 소셜벤처 아이디어에 가깝습니다.",
  },
];

const SOCIAL_VENTURE_IMAGE = "socialventure.jpg";
const LUNA_LOGO = "luna-logo.svg";
const LUNA_CHARACTERS = {
  basic: "luna-character-basic.png",
  flower: "luna-character-flower.png",
  moon: "luna-character-moon.png",
  wave: "luna-character-wave.png",
};

const screenVariants = {
  enter: (reduced: boolean) => ({
    opacity: 0,
    y: reduced ? 0 : 16,
    scale: reduced ? 1 : 0.98,
  }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: (reduced: boolean) => ({
    opacity: 0,
    y: reduced ? 0 : -14,
    scale: reduced ? 1 : 0.98,
  }),
};

const introContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const riseItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const optionContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
    },
  },
};

const optionItem = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
};

function App() {
  const prefersReducedMotion = useReducedMotion();
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const passingScore = questions.length - 1;
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
  const selectedCorrect =
    selectedIndex !== null && selectedIndex === currentQuestion.answerIndex;
  const resultPassed = score >= passingScore;

  const reduced = Boolean(prefersReducedMotion);

  const transition = useMemo(
    () =>
      reduced
        ? { duration: 0.01 }
        : { type: "spring" as const, stiffness: 230, damping: 24 },
    [reduced],
  );

  useEffect(() => {
    if (!isImageModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeImageModal();
      }
    };

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isImageModalOpen]);

  function showIntro() {
    setScreen("intro");
    setCurrentQuestionIndex(0);
    setAnswered(false);
    setSelectedIndex(null);
  }

  function startQuiz() {
    setScore(0);
    setCurrentQuestionIndex(0);
    setAnswered(false);
    setSelectedIndex(null);
    setScreen("quiz");
  }

  function selectOption(index: number) {
    if (answered) {
      return;
    }

    setSelectedIndex(index);
    setAnswered(true);

    if (index === currentQuestion.answerIndex) {
      setScore((previousScore) => previousScore + 1);
    }
  }

  function goNext() {
    if (!answered) {
      return;
    }

    if (isLastQuestion) {
      showResult();
      return;
    }

    setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
    setAnswered(false);
    setSelectedIndex(null);
  }

  function showResult() {
    setScreen("result");
  }

  function resetQuiz(target: Screen = "quiz") {
    setScore(0);
    setCurrentQuestionIndex(0);
    setAnswered(false);
    setSelectedIndex(null);
    setScreen(target);
  }

  function openImageModal() {
    if (!imageFailed) {
      setIsImageModalOpen(true);
    }
  }

  function closeImageModal() {
    setIsImageModalOpen(false);
  }

  function getOptionClass(index: number) {
    if (!answered) {
      return "option-button";
    }

    if (index === currentQuestion.answerIndex) {
      return "option-button is-correct";
    }

    if (index === selectedIndex) {
      return "option-button is-wrong";
    }

    return "option-button is-muted";
  }

  function getOptionMotion(index: number) {
    if (!answered || reduced) {
      return {};
    }

    if (index === currentQuestion.answerIndex) {
      return {
        scale: [1, 1.035, 1],
        boxShadow: [
          "0 10px 24px rgba(82, 75, 155, 0.08)",
          "0 0 0 5px rgba(30, 155, 98, 0.14), 0 14px 28px rgba(30, 155, 98, 0.18)",
          "0 10px 24px rgba(82, 75, 155, 0.08)",
        ],
      };
    }

    if (index === selectedIndex) {
      return {
        x: [0, -6, 6, -4, 4, 0],
      };
    }

    return {};
  }

  return (
    <MotionConfig reducedMotion="user" transition={transition}>
      <main className="app" aria-live="polite">
        <div className="ambient-lines" aria-hidden="true" />
        <div className="app-shell">
          <header className="brand-bar" aria-label="LUNA 부스 퀴즈">
            <div className="brand-lockup">
              <img className="brand-logo" src={LUNA_LOGO} alt="" aria-hidden="true" />
              <span>LUNA</span>
            </div>
          </header>

          <AnimatePresence mode="wait" custom={reduced}>
            {screen === "intro" && (
              <motion.section
                key="intro"
                className="screen introScreen"
                custom={reduced}
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <motion.div
                  className="screen-inner intro-stack"
                  variants={introContainer}
                  initial="hidden"
                  animate="show"
                >
                  <motion.div className="decor-cluster mascot-cluster" variants={riseItem} aria-hidden="true">
                    <span className="tiny-star star-a" />
                    <span className="tiny-star star-b" />
                    <img className="intro-mascot" src={LUNA_CHARACTERS.moon} alt="" />
                  </motion.div>

                  <motion.div className="intro-copy" variants={riseItem}>
                    <h1>소셜벤처 퀴즈</h1>
                    <p>소개 자료를 보고 9문제 이상 맞히면<br/> 돌림판 기회가 주어집니다.</p>
                  </motion.div>

                  <motion.div className="intro-image-panel" variants={riseItem}>
                    <button
                      className="image-card"
                      type="button"
                      onClick={openImageModal}
                      disabled={imageFailed}
                      aria-label="소셜벤처 소개 자료 크게 보기"
                    >
                      {/* socialventure.jpg 파일명만 바꾸면 아래 상수만 수정하면 됩니다. */}
                      {!imageFailed ? (
                        <img
                          src={SOCIAL_VENTURE_IMAGE}
                          alt="소셜벤처 소개 자료"
                          onError={() => setImageFailed(true)}
                        />
                      ) : (
                        <span className="image-fallback">
                          socialventure.jpg
                          <small>이미지 파일을 index.html과 같은 폴더에 넣어주세요.</small>
                        </span>
                      )}
                    </button>
                    <p className="image-help">이미지를 누르면 크게 볼 수 있어요.</p>
                  </motion.div>

                  <motion.button
                    className="primary-button"
                    type="button"
                    variants={riseItem}
                    whileTap={reduced ? undefined : { scale: 0.97 }}
                    onClick={startQuiz}
                  >
                    퀴즈 시작하기
                  </motion.button>
                </motion.div>
              </motion.section>
            )}

            {screen === "quiz" && (
              <motion.section
                key="quiz"
                className="screen quizScreen"
                custom={reduced}
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="screen-inner quiz-stack">
                  <div className="progress-block">
                    <div className="progress-copy">
                      <span>
                        문제 {currentQuestionIndex + 1} / {questions.length}
                      </span>
                      <strong>{score}점</strong>
                    </div>
                    <div className="progress-track" aria-hidden="true">
                      <motion.div
                        className="progress-fill"
                        initial={false}
                        animate={{ width: `${progressPercent}%` }}
                        transition={reduced ? { duration: 0.01 } : { duration: 0.38, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait" custom={reduced}>
                    <motion.div
                      key={currentQuestionIndex}
                      className="question-panel"
                      custom={reduced}
                      initial={{ opacity: 0, x: reduced ? 0 : 18, y: reduced ? 0 : 8 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, x: reduced ? 0 : -18, y: reduced ? 0 : 14 }}
                    >
                      <h2>{currentQuestion.question}</h2>

                      <motion.div
                        className="options-list"
                        variants={optionContainer}
                        initial="hidden"
                        animate="show"
                      >
                        {currentQuestion.options.map((option, index) => (
                          <motion.button
                            key={option}
                            type="button"
                            className={getOptionClass(index)}
                            variants={optionItem}
                            animate={getOptionMotion(index)}
                            whileTap={!answered && !reduced ? { scale: 1.025 } : undefined}
                            onClick={() => selectOption(index)}
                            disabled={answered}
                            aria-pressed={selectedIndex === index}
                          >
                            <span className="option-index">{index + 1}</span>
                            <span>{option}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>

                  <AnimatePresence>
                    {answered && (
                      <motion.div
                        className={`feedback-panel ${selectedCorrect ? "is-good" : "is-bad"}`}
                        initial={{ opacity: 0, y: reduced ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                      >
                        <strong>{selectedCorrect ? "정답입니다!" : "아쉽지만 오답입니다."}</strong>
                        <p>{currentQuestion.explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!answered && (
                    <motion.div
                      className="quiz-mascot-stage"
                      aria-hidden="true"
                      initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <motion.img
                        className="quiz-hover-mascot"
                        src={LUNA_CHARACTERS.wave}
                        alt=""
                        animate={
                          reduced
                            ? undefined
                            : {
                                y: [0, -12, 0],
                                rotate: [-2, 2, -2],
                              }
                        }
                        transition={{
                          duration: 3.4,
                          ease: "easeInOut",
                          repeat: Infinity,
                        }}
                      />
                    </motion.div>
                  )}

                  <motion.button
                    className="next-button"
                    type="button"
                    whileTap={answered && !reduced ? { scale: 0.98 } : undefined}
                    onClick={goNext}
                    disabled={!answered}
                  >
                    {isLastQuestion ? "결과 보기" : "다음 문제"}
                  </motion.button>
                </div>
              </motion.section>
            )}

            {screen === "result" && (
              <motion.section
                key="result"
                className="screen resultScreen"
                custom={reduced}
                variants={screenVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <motion.div
                  className={`screen-inner result-stack ${resultPassed ? "is-success" : "is-fail"}`}
                  initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="result-header">
                    <img
                      className="result-mascot"
                      src={resultPassed ? LUNA_CHARACTERS.flower : LUNA_CHARACTERS.wave}
                      alt=""
                      aria-hidden="true"
                    />
                    <h2>{resultPassed ? "축하합니다!" : "아쉽습니다!"}</h2>
                    <p>
                      {resultPassed
                        ? `${passingScore}문제 이상 맞혔습니다.`
                        : `${passingScore}문제 이상 맞혀야 돌림판 기회를 받을 수 있어요.`}
                    </p>
                  </div>

                  {resultPassed ? (
                    <>
                      <strong className="chance-text">돌림판을 돌릴 기회가 주어졌습니다!</strong>
                      <div className="coupon-wrap" aria-label="돌림판 쿠폰">
                        <span className="coupon-star coupon-star-one" aria-hidden="true" />
                        <span className="coupon-star coupon-star-two" aria-hidden="true" />
                        <span className="coupon-moon" aria-hidden="true" />
                        <div className="coupon">
                          <span className="coupon-top">LUNA BOOTH COUPON</span>
                          <strong>돌림판 1회권</strong>
                          <span className="coupon-bottom">이 화면을 부스 운영진에게 보여주세요.</span>
                        </div>
                      </div>
                      <motion.button
                        className="primary-button"
                        type="button"
                        whileTap={reduced ? undefined : { scale: 0.97 }}
                        onClick={() => resetQuiz("quiz")}
                      >
                        다시 풀기
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <div className="score-pill">내 점수: {score} / {questions.length}</div>
                      <div className="result-actions">
                        <motion.button
                          className="primary-button"
                          type="button"
                          whileTap={reduced ? undefined : { scale: 0.97 }}
                          onClick={() => resetQuiz("quiz")}
                        >
                          다시 도전하기
                        </motion.button>
                        <motion.button
                          className="secondary-button"
                          type="button"
                          whileTap={reduced ? undefined : { scale: 0.98 }}
                          onClick={showIntro}
                        >
                          소개 자료 다시 보기
                        </motion.button>
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isImageModalOpen && (
            <motion.div
              className="imageModal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-label="소셜벤처 소개 자료 확대 보기"
            >
              <button className="modal-backdrop" type="button" onClick={closeImageModal} tabIndex={-1} />
              <motion.div
                className="modal-content"
                initial={{ opacity: 0, scale: reduced ? 1 : 0.94, y: reduced ? 0 : 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 10 }}
              >
                <button className="modal-close" type="button" onClick={closeImageModal}>
                  닫기
                </button>
                {/* socialventure.png를 다른 파일명으로 바꿀 때는 SOCIAL_VENTURE_IMAGE 상수만 수정하세요. */}
                <img src={SOCIAL_VENTURE_IMAGE} alt="소셜벤처 소개 자료" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}

export default App;
