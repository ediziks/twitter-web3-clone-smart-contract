// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

contract TweetFactory {
    // Mappings
    mapping(uint32 => address) public tweetToOwner;

    // Define Structure of the tweet
    struct Tweet {
        uint32 tweetId;
        string tweet;
        address owner;
        uint32 publishedTime;
    }

    // Events
    event NewTweet(
        uint32 tweetId,
        string tweet,
        address owner,
        uint32 publishedTime
    );
    event UpdatedTweet(
        uint32 tweetId,
        string tweet,
        address owner,
        uint32 publishedTime
    );
    event DeleteTweet(
        uint32 tweetId
    );

    // Main Variable
    Tweet[] public tweets;

    /**
     * @dev Create tweet for a user
     * @param _tweet the actual tweet text
     */
    function createTweet(string memory _tweet) public {
        uint32 _length = uint32(tweets.length);

        tweets.push(
            Tweet(_length, _tweet, msg.sender, uint32(block.timestamp))
        );

        tweetToOwner[_length] = msg.sender;

        emit NewTweet(_length, _tweet, msg.sender, uint32(block.timestamp));
    }

    function updateTweet(uint256 _tweetId, string memory _tweet) external {
        require(
            msg.sender == tweetToOwner[uint32(_tweetId)],
            "You need to be the tweet owner"
        );

        tweets[_tweetId].tweet = _tweet;

        emit UpdatedTweet(uint32(_tweetId), _tweet, msg.sender, uint32(tweets[_tweetId].publishedTime));
    }

    function deleteTweet(uint256 _tweetId) external {
        require(
            msg.sender == tweetToOwner[uint32(_tweetId)],
            "You need to be the tweet owner"
        );

        tweets[_tweetId] = Tweet(uint32(0), "", address(0), uint32(0));
        tweetToOwner[uint32(_tweetId)] = address(0);
        
        emit DeleteTweet(uint32(_tweetId));
    }

    /**
     * @dev get the tweets
     */
    function getTweets() public view returns ( Tweet[] memory ) {
        return tweets;
    }
}
