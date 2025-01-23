import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const createMessage = async (req, res, next) => {
  try {
    const newMessage=new Message({
      conversationId: req.body.conversationId,
      userId: req.userId,
      desc: req.body.desc,
    })
    const savedMessage=await newMessage.save();
    await Conversation.findOneAndUpdate({id:req.body.conversationId},{
        $set:{
            readBySeller:req.isSeller,
            readByBuyer:!req.isSeller,
            lastMessage: req.body.desc,
        }
    },
        {new:true}
    )
    res.status(201).json(savedMessage);

  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    })
    const messagesWithUserImage = await Promise.all(messages.map(async (message) => {
      const user = await User.findOne({ _id: message.userId }).select('img');
      return {
        ...message.toObject(),
        userImage: user ? user.img : null,
      };
    }));
    
    res.status(200).json(messagesWithUserImage);
  } catch (error) {
    next(error);
  }
};
