const {mentorsProfile} = require('../models/mentors')
const jwt = require('jsonwebtoken');

exports.initializeSocketIO = async(io) => {
    return io.on("connection", async (socket) => {
      try {
        const token = socket.handshake.headers.authorization.replace('Bearer ', '');
  
        const decoded = jwt.verify(token,'your-secret-key');
        
        const wherecondition = {
            id: decoded.userId
          };
        
          const result = await mentorsProfile('users', wherecondition);
        // Assuming you have a SQL database connection established, you would perform a query like this to fetch user data.
        // This example assumes a table named 'users'.
  
        // if (!user || user.length === 0) {
        //   return res.status(401).json({
        //     status: 200,
        //     message: 'Un-authorized handshake. Token is invalid',
        //     success: false,
        //   });
        // }
        console.log(result[0]);
        socket.user = result[0].id; // Assuming the user is the first result
  
        socket.join(result[0].id.toString());
        // socket.emit(ChatEventEnum.CONNECTED_EVENT);
        console.log("User connected. userId: ", result[0].id);


        // mountJoinChatEvent(socket);
        // mountParticipantTypingEvent(socket);
        // mountParticipantStoppedTypingEvent(socket);
  
        // socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        //   console.log("user has disconnected 🚫. userId: " + socket.id);
        //   if (socket.id) {
        //     socket.leave(socket.id);
        //   }
        // });
      } catch (error) {

        console.log(error)
        // socket.emit(
        //   ChatEventEnum.SOCKET_ERROR_EVENT,
        //   error?.message || "Something went wrong while connecting to the socket."
        // );
      }
    });
};

