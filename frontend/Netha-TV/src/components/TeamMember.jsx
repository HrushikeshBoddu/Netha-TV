import { motion } from 'framer-motion';

const TeamMember = ({ member, delay = 0 }) => {
  return (
    <motion.div
      className="team-member"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="member-image">
        <img 
          src={member.image} 
          alt={member.name}
          loading="lazy"
        />
      </div>
      <div className="member-info">
        <h3>{member.name}</h3>
        <p className="role">{member.role}</p>
        <p className="bio">{member.bio}</p>
      </div>
    </motion.div>
  );
};

export default TeamMember;