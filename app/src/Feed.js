import React, { useState, useEffect } from "react";
import TweetBox from "./TweetBox";
import Post from "./Post";
import FlipMove from "react-flip-move";
import "./Feed.css";
import { TwitterContractAddress } from "./utils/config.js";
import { ethers } from "ethers";
import TweetFactory from "./utils/TweetFactory.json";

function Feed({ personal }) {
  // const [edit, setEdit] = useState(false);
  const [posts, setPosts] = useState([]);

  const getUpdatedTweets = (allTweets, address) => {
    let updatedTweets = [];
    for (let i = allTweets.length - 1; i >= 0; i--) {
      const pdate = new Date(allTweets[i].publishedTime * 1000);
      let tweet = {
        id: allTweets[i].tweetId,
        tweetText: allTweets[i].tweet,
        isDeleted: allTweets[i].isDeleted,
        username: allTweets[i].owner,
        pdate: `${pdate.toLocaleDateString(
          "en-US"
        )} ${pdate.toLocaleTimeString()}`,
        deleted: false,
        personal: false,
      };

      // don't show empty/deleted tweets
      if (
        allTweets[i].tweet === "" ||
        allTweets[i].owner === "0x0000000000000000000000000000000000000000"
      ) {
        tweet.deleted = true;
      }

      if (allTweets[i].owner.toLowerCase() === address.toLowerCase()) {
        tweet.personal = true;
      }

      updatedTweets.push(tweet);
    }
    return updatedTweets;
  };

  const getTweets = async () => {
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

        let allTweets = await TwitterContract.getTweets();
        setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const TwitterContract = new ethers.Contract(
      TwitterContractAddress,
      TweetFactory.abi,
      signer
    );

    TwitterContract.on("NewTweet", (tweetId) => {
      console.log("NewTweet event fired");
      getTweets();
    });

    TwitterContract.on("UpdatedTweet", (tweetId) => {
      console.log("NewTweet event fired after update");
      getTweets();
    });

    getTweets();
  }, []);

  const addTweet = async (tweetText) => {
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

        let tx = await TwitterContract.addTweet(tweetText);
        console.log(tx);
        getTweets();
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTweet = (key) => async () => {
    console.log(key);

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

        await TwitterContract.deleteTweet(key);
        let allTweets = await TwitterContract.getTweets();
        setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Feed</h2>
      </div>
      <TweetBox addTweet={addTweet} />
      <FlipMove>
        {posts
          .filter((p) => !p.deleted)
          .map((post) => (
            <Post
              key={post.id}
              postId={post.id}
              displayName={post.username}
              text={post.tweetText}
              pdate={post.pdate}
              personal={post.personal}
              onClick={deleteTweet(post.id)}
            />
          ))}
      </FlipMove>
    </div>
  );
}

export default Feed;
