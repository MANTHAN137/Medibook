// Stats Card Component
import Card from '../common/Card';
import './StatsCard.css';

const StatsCard = ({ title, value, icon: Icon, color = 'primary', trend }) => {
    return (
        <Card className={`stats-card stats-card-${color}`}>
            <div className="stats-icon">
                <Icon size={24} />
            </div>
            <div className="stats-content">
                <span className="stats-value">{value}</span>
                <span className="stats-title">{title}</span>
            </div>
            {trend && (
                <div className={`stats-trend ${trend > 0 ? 'up' : 'down'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </div>
            )}
        </Card>
    );
};

export default StatsCard;
