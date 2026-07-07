import { Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  badgeColor?: 'primary' | 'gold' | 'emerald';
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="page-header">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Breadcrumb */}
        <nav className="page-header-breadcrumb">
          <Link to="/" style={{ color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Home size={13} /> Home
          </Link>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.35)' }} />
          <span style={{ color: 'rgba(255,255,255,0.85)' }}>{title}</span>
        </nav>

        <h1 className="page-header-title">{title}</h1>
        {description && (
          <p className="page-header-desc">{description}</p>
        )}
      </div>
    </section>
  );
}
