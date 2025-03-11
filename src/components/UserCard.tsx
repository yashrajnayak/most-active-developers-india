import { UserProfile } from '@/types';
import { ExternalLink, Star, Users } from 'lucide-react';
import { formatNumber } from '@/utils/formatters';

interface UserCardProps {
  user: UserProfile;
  index: number;
}

const UserCard = ({ user, index }: UserCardProps) => {
  return (
    <div className={`h-full animate-fade-in`} style={{ animationDelay: `${index * 100}ms` }}>
      <div className="bg-card rounded-xl overflow-hidden shadow-elevation-1 border h-full transition-shadow hover:shadow-elevation-3">
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <span className="absolute -top-1 -left-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center z-10">
                {user.rank}
              </span>
              <img 
                src={user.avatar_url} 
                alt={user.login}
                className="w-16 h-16 rounded-full object-cover border border-muted"
                loading="lazy"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold truncate text-foreground">
                  {user.name || user.login}
                </h3>
                <a 
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={`Visit ${user.login}'s GitHub profile`}
                >
                  <ExternalLink size={16} />
                </a>
              </div>
              
              <a 
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline block truncate"
              >
                @{user.login}
              </a>
              
              <div className="h-[48px] mt-2">
                {user.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2 text-balance">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
            {user.location && (
              <div className="col-span-2 text-sm text-muted-foreground">
                <span className="inline-block bg-muted rounded-full px-3 py-1">
                  📍 {user.location}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-1.5 text-sm">
              <Users size={14} className="text-muted-foreground" />
              <span className="text-foreground font-medium">
                {formatNumber(user.followers)}
              </span>
              <span className="text-muted-foreground">
                followers
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 text-sm">
              <Star size={14} className="text-amber-500" />
              <span className="text-foreground font-medium">
                {formatNumber(user.total_stars)}
              </span>
              <span className="text-muted-foreground">
                stars
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
