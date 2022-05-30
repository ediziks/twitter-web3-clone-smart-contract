const { expect } = require("chai");
const { ethers } = require("hardhat");
require("chai").should();

describe("TweetFactory", () => {
    let TweetFactory;
    let tweetFactory;
    let user1;
    let user2;

    beforeEach(async () => {
        TweetFactory = await ethers.getContractFactory("TweetFactory");
        [user1, user2] = await ethers.getSigners();

        tweetFactory = await TweetFactory.deploy();
    });

    // Test for create tweet
    it("should create a tweet", async () => {
        await tweetFactory.connect(user1).createTweet("Hello Everyone");
        const tweets = await tweetFactory.getTweets();

        expect(tweets.length).to.equal(1);
    });

    // Create tweet should emit event
    it("create a tweet should emit event", async () => {
        await expect(
            tweetFactory.connect(user1).createTweet("Hello Everyone"),
        ).to.emit(tweetFactory, "NewTweet");
    });

    // Test error of creating tweet
    it("should not be able to create tweet", async () => {
        await tweetFactory
            .connect(user1)
            .createTweet("Should give an error", "also").should.be.reverted;
    });

    // Test update tweet
    it("should update a tweet", async () => {
        await tweetFactory.connect(user1).createTweet("Hello Everyone");
        await tweetFactory.connect(user1).updateTweet(0, "Hello to John only");

        const tweets = await tweetFactory.getTweets();

        expect(tweets.length).to.equal(1);
        expect(tweets[0].tweet).to.equal("Hello to John only");
    });

    // Test update tweet among other tweets
    it("should update one among two tweets", async () => {
        await tweetFactory.connect(user1).createTweet("Hello Everyone");
        await tweetFactory.connect(user1).createTweet("How are you everyone");
        await tweetFactory.connect(user1).updateTweet(1, "How are you john");

        const tweets = await tweetFactory.getTweets();

        expect(tweets.length).to.equal(2);
        expect(tweets[0].tweet).to.equal("Hello Everyone");
        expect(tweets[1].tweet).to.equal("How are you john");
    });

    // Test update tweet failure
    it("should not be able to update other user tweet", async () => {
        await tweetFactory.connect(user1).createTweet("Hello Everyone");
        await tweetFactory
            .connect(user2)
            .createTweet("Hello Everyone and john");

        await tweetFactory.connect(user1).updateTweet(1, "Don't greet john")
            .should.be.reverted;
    });

    // Update tweet should emit event
    it("update a tweet should emit event", async () => {
        await tweetFactory.connect(user1).createTweet("Hello Everyone");
        await expect(
            tweetFactory.connect(user1).updateTweet(0, "Hello John"),
        ).to.emit(tweetFactory, "UpdatedTweet");
    });

    // Update tweet with wrong tweet id should fail
    it("update a tweet with wrong tweet id should fail", async () => {
        await tweetFactory.connect(user1).createTweet("Hello Everyone");
        await expect(
            tweetFactory.connect(user1).updateTweet(1, "Hello Everyone"),
        ).to.be.reverted;
    });

    // Delete a tweet with a given _tweetId
    it("should delete a tweet", async () => {
        await tweetFactory.connect(user1).createTweet("Hello Everyone");
        await tweetFactory.connect(user1).deleteTweet(0);

        const tweets = await tweetFactory.getTweets();
        const lasttweet = tweets[0];

        expect(tweets.length).to.equal(1);
        expect(lasttweet.tweet).to.equal("");
    });

    // Delete a tweet with a given _tweetId among others
    it("should delete a tweet among others", async () => {
        await tweetFactory.connect(user1).createTweet("Hello Everyone");
        await tweetFactory.connect(user2).createTweet("How are you");
        await expect(tweetFactory.connect(user1).deleteTweet(1)).to.be.reverted;

        const tweets = await tweetFactory.getTweets();
        expect(tweets.length).to.equal(2);
    });

    // Should not be able to delete another user tweet
    it("should not delete another user's tweet", async () => {
        await tweetFactory.connect(user1).createTweet("Hello Everyone");
        await expect(tweetFactory.connect(user2).deleteTweet(0)).to.be.reverted;
    });
});
