import Head from "next/head";
import { Inter } from "@next/font/google";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });
import styles from "../styles/Home.module.css";

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
    console.log("result", result);
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
    <>
      <Head>
        <title>Cat App</title>
        <meta name="description" content="cat quiz" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.width}>
          <h1>ねこちゃんの種類を当てよう！</h1>
          <ul className={styles.grid}>
            {catImageList !== undefined && catImageList.length ? (
              catImageList.map((catImage: catImage) => (
                <li key={catImage.id} className={styles.card}>
                  <img src={catImage.url} alt="" className={styles.width} />
                </li>
              ))
            ) : (
              <li>ねこちゃんを呼んでいます...</li>
            )}
          </ul>
          {!isAnswered ? (
            <select
              name="cat"
              id="js-cat-option"
              value={selectedCat}
              onChange={selectCatChange}
              className={styles.select}
            >
              {catSeedsList !== undefined && catSeedsList.length ? (
                catSeedsList.map((catSeed: any) => (
                  <option key={catSeed.id} value={catSeed.id}>
                    {catSeed.name}
                  </option>
                ))
              ) : (
                <option>ねこちゃんを呼んでいます...</option>
              )}
            </select>
          ) : (
            ""
          )}
          {isAnswered && isCorrect ? (
            <h3 className={styles.margin}>正解です！！！</h3>
          ) : (
            ""
          )}
          {isAnswered && !isCorrect ? (
            <h3 className={styles.margin}>残念！</h3>
          ) : (
            ""
          )}
          {isAnswered && answerCat ? (
            <div className={styles.answer}>
              <h2 className={styles.h2}>正解は{answerCat.name}です</h2>
              <div className={styles.margin}>
                <h3>解説</h3>
                {answerCat.description}
              </div>
              <a
                href={answerCat.wikipedia_url}
                className={styles.link}
                target="_blank"
                rel="noreferrer"
              >
                Wikipediaで詳細を見る&nbsp;&gt;&gt;
              </a>
            </div>
          ) : (
            ""
          )}
          {!isAnswered ? (
            <button type="button" onClick={answer} className={styles.button}>
              回答する
            </button>
          ) : (
            ""
          )}
          <button type="button" onClick={restart} className={styles.button}>
            初めから
          </button>
        </div>
      </main>
    </>
  );
}
