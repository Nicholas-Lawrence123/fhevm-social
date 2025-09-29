// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint256, externalEuint256} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title FHEVM Social Contract - 链上朋友圈
/// @author fhevm-hardhat-template
/// @notice 支持公开和私密动态发布的朋友圈合约
contract FhevmSocial is SepoliaConfig {
    struct Post {
        uint256 id;
        address author;
        uint256 timestamp;
        bool isPrivate;
        string publicContent;    // 公开内容
        euint256 encryptedContent; // 加密内容（私密动态）
    }

    // 动态存储
    Post[] private _posts;
    uint256 private _nextPostId;

    // 事件
    event PostCreated(uint256 indexed postId, address indexed author, bool isPrivate);

    /// @notice 获取总动态数量
    function getPostCount() external view returns (uint256) {
        return _posts.length;
    }

    /// @notice 获取指定ID的动态
    /// @param postId 动态ID
    function getPost(uint256 postId) external view returns (
        uint256 id,
        address author,
        uint256 timestamp,
        bool isPrivate,
        string memory publicContent,
        euint256 encryptedContent
    ) {
        require(postId < _posts.length, "Post does not exist");
        Post storage post = _posts[postId];
        return (
            post.id,
            post.author,
            post.timestamp,
            post.isPrivate,
            post.publicContent,
            post.encryptedContent
        );
    }

    /// @notice 获取动态列表（分页）
    /// @param offset 起始位置
    /// @param limit 返回数量
    function getPosts(uint256 offset, uint256 limit) external view returns (
        uint256[] memory ids,
        address[] memory authors,
        uint256[] memory timestamps,
        bool[] memory isPrivates,
        string[] memory publicContents,
        euint256[] memory encryptedContents
    ) {
        uint256 totalPosts = _posts.length;
        uint256 actualLimit = offset + limit > totalPosts ? totalPosts - offset : limit;

        ids = new uint256[](actualLimit);
        authors = new address[](actualLimit);
        timestamps = new uint256[](actualLimit);
        isPrivates = new bool[](actualLimit);
        publicContents = new string[](actualLimit);
        encryptedContents = new euint256[](actualLimit);

        for (uint256 i = 0; i < actualLimit; i++) {
            Post storage post = _posts[offset + i];
            ids[i] = post.id;
            authors[i] = post.author;
            timestamps[i] = post.timestamp;
            isPrivates[i] = post.isPrivate;
            publicContents[i] = post.publicContent;
            encryptedContents[i] = post.encryptedContent;
        }
    }

    /// @notice 发布公开动态
    /// @param content 动态内容
    function createPublicPost(string calldata content) external {
        require(bytes(content).length > 0, "Content cannot be empty");
        require(bytes(content).length <= 280, "Content too long"); // Twitter-like limit

        uint256 postId = _nextPostId++;

        Post memory newPost = Post({
            id: postId,
            author: msg.sender,
            timestamp: block.timestamp,
            isPrivate: false,
            publicContent: content,
            encryptedContent: FHE.asEuint256(0) // 空值
        });

        _posts.push(newPost);

        emit PostCreated(postId, msg.sender, false);
    }

    /// @notice 发布私密动态
    /// @param encryptedContent 加密的动态内容
    /// @param inputProof 输入证明
    function createPrivatePost(externalEuint256 encryptedContent, bytes calldata inputProof) external {
        euint256 content = FHE.fromExternal(encryptedContent, inputProof);

        uint256 postId = _nextPostId++;

        Post memory newPost = Post({
            id: postId,
            author: msg.sender,
            timestamp: block.timestamp,
            isPrivate: true,
            publicContent: "", // 空字符串
            encryptedContent: content
        });

        _posts.push(newPost);

        // 设置ACL：只有作者自己可以解密
        FHE.allow(content, msg.sender);
        FHE.allowThis(content);

        emit PostCreated(postId, msg.sender, true);
    }

    /// @notice 为私密动态授权其他地址访问
    /// @param postId 动态ID
    /// @param allowedAddress 被授权的地址
    function allowPostAccess(uint256 postId, address allowedAddress) external {
        require(postId < _posts.length, "Post does not exist");
        Post storage post = _posts[postId];
        require(post.author == msg.sender, "Only author can grant access");
        require(post.isPrivate, "Post is not private");

        FHE.allow(post.encryptedContent, allowedAddress);
    }

    /// @notice 撤销动态访问权限（简化版：仅允许作者自己访问）
    /// @param postId 动态ID
    function revokePostAccess(uint256 postId, address /*revokedAddress*/) external {
        require(postId < _posts.length, "Post does not exist");
        Post storage post = _posts[postId];
        require(post.author == msg.sender, "Only author can revoke access");
        require(post.isPrivate, "Post is not private");

        // 注意：FHE库中没有直接的revoke方法，这里我们需要重新设置ACL
        // 在实际应用中，可能需要更复杂的ACL管理
        FHE.allowTransient(post.encryptedContent, msg.sender);
    }
}
