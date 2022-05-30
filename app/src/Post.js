import React, { forwardRef, useState } from "react";
import "./Post.css";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import PublishIcon from "@material-ui/icons/Publish";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Button } from "@material-ui/core";
import { ethers } from "ethers";
import TweetFactory from "./utils/TweetFactory.json";
import { TwitterContractAddress } from "./utils/config.js";

const Post = forwardRef(
  ({ postId, displayName, text, personal, pdate, onClick }, ref) => {
    const [showMode, setShowMode] = useState(true);
    const [updatedTweetMessage, setUpdatedTweetMessage] = useState(text);

    const handleChangeMode = () => {
      setShowMode(!showMode);
    };

    const editTweet = (key, tweetText) => async () => {
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

          await TwitterContract.updateTweet(key, tweetText);
          setShowMode(true);
        } else {
          console.log("Ethereum object doesn't exist");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (showMode) {
      return (
        <div className="post" ref={ref}>
          <div className="post__body">
            <div className="post__header">
              <div className="post__headerText">
                <h3>{displayName} </h3>
              </div>
              <div className="post__headerDescription">
                <p>{text}</p>
              </div>
            </div>
            <div className="post__footer">
              <ChatBubbleOutlineIcon fontSize="small" />
              <RepeatIcon fontSize="small" />
              <FavoriteBorderIcon fontSize="small" />
              <PublishIcon fontSize="small" />
              {personal ? (
                <DeleteIcon
                  fontSize="small"
                  className="activeButton"
                  onClick={onClick}
                />
              ) : (
                ""
              )}
              {personal ? (
                <EditIcon
                  fontSize="small"
                  className="activeButton"
                  onClick={handleChangeMode}
                />
              ) : (
                ""
              )}
            </div>
            <p className="publishedDate">{pdate}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="post" ref={ref}>
          <div className="post__body">
            <div className="post__header">
              <div className="post__headerText">
                <h3>{displayName} </h3>
              </div>
              <div className="post__headerDescription">
                <form>
                  <div className="tweetBox__input">
                    <input
                      onChange={(e) => setUpdatedTweetMessage(e.target.value)}
                      placeholder="What's happening?"
                      type="text"
                      value={updatedTweetMessage}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="post__footer">
              <Button
                onClick={editTweet(postId, updatedTweetMessage)}
                type="submit"
                className="tweetBox__tweetButton"
              >
                Update
              </Button>
            </div>
          </div>
          <p>{pdate}</p>
        </div>
      );
    }
  }
);

export default Post;
