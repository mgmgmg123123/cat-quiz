import Head from "next/head";
import styled from "styled-components";
import { Inter } from "@next/font/google";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  type catSeeds = {
    id: string;
    name: string;
    description: string;
    wikipedia_url: string;
  };
  type catImage = {
    id: string;
    url: string;
    width?: number;
    height?: number;
  };
  const [answerCat, setAnswerCat] = useState<catSeeds>();
  const [catSeedsList, setCatSeedsList] = useState<Array<catSeeds>>();
  const [catImageList, setCatImageList] = useState<Array<catImage>>();
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [selectedCat, setSelectedCat] = useState<string>();

  useEffect(() => {
    const initCat = async () => {
      const caySeeds: Array<catSeeds> = await fetchCatSeeds();
      const answerCatSeed: catSeeds = await choiceAnswerCat(caySeeds);
      getCatsImages(answerCatSeed);
      setIsAnswered(false);
      setIsCorrect(false);
      setSelectedCat("");
    };
    initCat();
  }, []);

  // ねこちゃんのリストを取得する
  const fetchCatSeeds = async () => {
    const res = await fetch("https://api.thecatapi.com/v1/breeds");
    const result = await res.json();
    const filteredResult: Array<catSeeds> = [];
    result.forEach((item: any) => {
      filteredResult.push({
        id: item.id,
        name: item.name,
        description: item.description,
        wikipedia_url: item.wikipedia_url,
      });
    });
    setCatSeedsList(filteredResult);
    return filteredResult;
  };

  // 正解となる、ねこちゃんを決める
  const choiceAnswerCat = (list: any) => {
    const answerCatIndex = Math.floor(Math.random() * (list.length + 1));
    setAnswerCat(list[answerCatIndex]);
    return list[answerCatIndex];
  };

  // 正解となる、ねこちゃんの画像を取得する
  const getCatsImages = async (answerCatSeed: catSeeds) => {
    const limit = 5;
    const requestUrl = `https://api.thecatapi.com/v1/images/search?limit=${limit}&breed_ids=${answerCatSeed.id}`;
    const res = await fetch(requestUrl);
    const result = await res.json();
    setCatImageList(result);
    return result;
  };

  // 答え合わせをする
  const answer = () => {
    const optionElement = document.querySelector("#js-cat-option");
    if (!optionElement || !answerCat) {
      return;
    }

    if (selectedCat === answerCat.id) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setIsAnswered(true);
  };

  // 初めからクイズをする
  const restart = () => {
    const initRestart = async () => {
      const answerCatSeed: catSeeds = await choiceAnswerCat(catSeedsList);
      getCatsImages(answerCatSeed);
      setIsAnswered(false);
      setIsCorrect(false);
      setSelectedCat("");
    };
    initRestart();
  };
  // 猫ちゃんを選ぶ
  const selectCatChange = (event: any) => {
    setSelectedCat(event.target.value);
  };

  return (
    <StyledMainWrap>
      <Head>
        <title>Cat App</title>
        <meta name="description" content="cat quiz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StyledHeader>
        <p>Cat Breed Quiz</p>
      </StyledHeader>
      <StyledMain>
        <StyledH1>Guess the cat breed!</StyledH1>
        <StyledUl>
          {catImageList !== undefined && catImageList.length ? (
            catImageList.map((catImage: catImage) => (
              <StyledLl key={catImage.id}>
                <StyledImg src={catImage.url} alt="" />
              </StyledLl>
            ))
          ) : (
            <li>Calling all cats...</li>
          )}
        </StyledUl>
        {!isAnswered ? (
          <StyledTextWrap>
            <StyledP>
              What is the type of this cat? <br />
              Choose your answer.
            </StyledP>
            <StyledSelectWrap>
              <StyledSelect
                name="cat"
                id="js-cat-option"
                value={selectedCat}
                onChange={selectCatChange}
              >
                {catSeedsList !== undefined && catSeedsList.length ? (
                  catSeedsList.map((catSeed: any) => (
                    <option key={catSeed.id} value={catSeed.id}>
                      {catSeed.name}
                    </option>
                  ))
                ) : (
                  <option>Calling all cats...</option>
                )}
              </StyledSelect>
            </StyledSelectWrap>
          </StyledTextWrap>
        ) : (
          ""
        )}
        {isAnswered && isCorrect ? <StyledH2>Correct answer!</StyledH2> : ""}
        {isAnswered && !isCorrect ? <StyledH2>Incorrect answer!</StyledH2> : ""}
        {isAnswered && answerCat ? (
          <StyledExplanationWrap>
            <StyledH3>Answer is {answerCat.name}</StyledH3>
            <StyledExplanation>{answerCat.description}</StyledExplanation>
            <StyledLink
              href={answerCat.wikipedia_url}
              target="_blank"
              rel="noreferrer"
            >
              Read more on Wikipedia&nbsp;&gt;&gt;
            </StyledLink>
          </StyledExplanationWrap>
        ) : (
          ""
        )}
        <StyledButtonWrap>
          {!isAnswered ? (
            <StyledButton type="button" onClick={answer}>
              Answer
            </StyledButton>
          ) : (
            ""
          )}
          <StyledButton type="button" onClick={restart}>
            Restart
          </StyledButton>{" "}
        </StyledButtonWrap>
      </StyledMain>
    </StyledMainWrap>
  );
}
const StyledMainWrap = styled.div`
  width: 100vw;
  color: #3e3e3e;
`;
const StyledHeader = styled.header`
  width: 100vw;
  height: 70px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  padding: 17px;
  p {
    font-size: 36px;
    font-weight: 700;
    text-align: center;
  }
`;
const StyledMain = styled.main`
  padding: 24px 12px 120px;
  width: 100%;
  text-align: center;
  @media screen and (min-width: 600px) {
    max-width: 1000px;
    margin: auto;
  }
`;
const StyledH1 = styled.h1`
  font-size: 30px;
  font-weight: 700;
  margin: 12px 0px 24px;
  @media screen and (min-width: 600px) {
    font-size: 36px;
  }
`;
const StyledH2 = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 12px 0px;
  @media screen and (min-width: 600px) {
    font-size: 30px;
  }
`;
const StyledH3 = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 12px 0px;
`;
const StyledUl = styled.ul`
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 36px;
`;
const StyledLl = styled.li`
  width: calc(50% - 2.5px);
  /* aspect-ratio: 16 / 13; */
  aspect-ratio: 1 / 1;

  max-width: 100%;
  overflow: hidden;
  border-radius: 10px;
  @media screen and (min-width: 600px) {
    width: calc(33.333% - 3.4px);
  }
`;
const StyledImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
`;
const StyledP = styled.p`
  margin: 48px 0px 24px;
  font-size: 16px;
  font-weight: 700;
  @media screen and (min-width: 600px) {
    font-size: 24px;
  }
`;
const StyledSelect = styled.select`
  width: 100%;
  padding: 12px 24px;
  text-align: center;
  border: 1px solid #3e3e3e;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 700;
  position: relative;
  &:hover {
    opacity: 0.7;
  }
`;
const StyledSelectWrap = styled.div`
  &::after {
    position: absolute;
    display: block;
    border-top: 2px solid #3e3e3e;
    border-right: 2px solid #3e3e3e;
    top: 4px;
    right: 35px;
    width: 15px;
    height: 15px;
    content: "";
    transform: translateY(50%) rotate(135deg);
  }
  position: relative;
  margin: 24px 0px;
`;
const StyledButtonWrap = styled.div`
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  @media screen and (min-width: 600px) {
    max-width: 600px;
    margin: auto;
  }
`;
const StyledButton = styled.button`
  width: calc(50% - 3px);
  padding: 16px 24px;
  text-align: center;
  color: #eee;
  background-color: #3e3e3e;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 700;
  position: relative;
  margin: auto;
  &:hover {
    opacity: 0.7;
  }
`;
const StyledExplanationWrap = styled.div`
  margin: 24px 0px;
  max-width: 100%;
  @media screen and (min-width: 700px) {
    max-width: 600px;
    margin: 24px auto;
  }
`;
const StyledTextWrap = styled.div`
  max-width: 100%;
  @media screen and (min-width: 700px) {
    max-width: 600px;
    margin: auto;
  }
`;
const StyledExplanation = styled.div`
  padding: 0px 12px;
  margin-bottom: 16px;
  text-align: left;
  word-break: normal;
`;
const StyledLink = styled.a`
  text-decoration: underline;
  font-weight: 500px;
`;
