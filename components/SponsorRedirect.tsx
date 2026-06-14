import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const SponsorRedirect: React.FC = () => {
  const { creatorName } = useParams<{ creatorName: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const trackAndRedirect = async () => {
      if (!creatorName) {
        return navigate('/', { replace: true });
      }

      try {
        // Fetch the active sponsor link from the sponsor_links table
        const { data: linkData } = await supabase
          .from('sponsor_links')
          .select('creator_name')
          .ilike('creator_name', creatorName)
          .eq('active', true)
          .maybeSingle();

        if (linkData) {
          // Log the click in sponsor_clicks (total count only)
          await supabase
            .from('sponsor_clicks')
            .insert({
              creator_name: linkData.creator_name,
            });
        } else {
          console.warn(`Sponsor link for ${creatorName} not found.`);
        }
      } catch (error) {
        console.error('Error tracking sponsor link:', error);
      }

      // Redirect user gracefully back to home page
      navigate('/', { replace: true });
    };

    trackAndRedirect();
  }, [creatorName, navigate]);

  return (
    <div className="min-h-[100dvh] bg-gray-900 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400 mb-4"></div>
      <p className="text-amber-400 text-sm font-medium">Entering Stoutly...</p>
    </div>
  );
};
