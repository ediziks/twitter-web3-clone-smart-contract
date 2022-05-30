import React, { useState } from "react";
import "./TweetBox.css";
import { Button } from "@material-ui/core";
import { TwitterContractAddress } from "./utils/config.js";
import { ethers } from "ethers";
import TweetFactory from "./utils/TweetFactory.json";

function TweetBox() {
  const [tweetMessage, setTweetMessage] = useState("");

  const createTweet = async () => {
    let tweet = {
      tweetId: Math.floor(Math.random() * 1000000),
      tweetText: tweetMessage,
    };

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TwitterContract = new ethers.Contract(
          TwitterContractAddress,
          TweetFactory.abi,
          signer
        );

        let twitterTx = await TwitterContract.createTweet(tweet.tweetText);

        console.log(twitterTx);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new Tweet", error);
    }
  };

  const sendTweet = (e) => {
    e.preventDefault();

    createTweet();

    setTweetMessage("");
  };

  return (
    <div className="tweetBox">
      <form>
        <div className="tweetBox__input">
          <input
            onChange={(e) => setTweetMessage(e.target.value)}
            value={tweetMessage}
            placeholder="What's happening?"
            type="text"
          />
        </div>

        <Button
          onClick={sendTweet}
          type="submit"
          className="tweetBox__tweetButton"
        >
          Tweet
        </Button>
      </form>
    </div>
  );
}

export default TweetBox;
