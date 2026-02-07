'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSocialStore } from '@/store/useSocialStore';

type TabType = 'friends' | 'requests';

interface Friend {
  id: string;
  username: string;
  avatar: string;
  totalLevel: number;
}

interface FriendRequest {
  id: string;
  username: string;
  avatar: string;
  userId: string;
}

const mockFriends: Friend[] = [
  { id: '1', username: 'Alex Chen', avatar: 'A', totalLevel: 5 },
  { id: '2', username: 'Jordan Smith', avatar: 'J', totalLevel: 8 },
  { id: '3', username: 'Sam Williams', avatar: 'S', totalLevel: 3 },
  { id: '4', username: 'Taylor Johnson', avatar: 'T', totalLevel: 12 },
];

const mockRequests: FriendRequest[] = [
  { id: '1', username: 'Morgan Lee', avatar: 'M', userId: 'user5' },
  { id: '2', username: 'Casey Davis', avatar: 'C', userId: 'user6' },
];

export default function FriendsPage() {
  const { friends, friendRequests } = useSocialStore();
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [searchQuery, setSearchQuery] = useState('');

  // Use mock data if store data is empty
  const friendsList = friends && friends.length > 0 ? friends : mockFriends;
  const requestsList = friendRequests && friendRequests.length > 0 ? friendRequests : mockRequests;

  // Filter friends based on search
  const filteredFriends = friendsList.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter requests based on search
  const filteredRequests = requestsList.filter((request) =>
    request.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAccept = (requestId: string) => {
    // In a real app, this would call an API
    console.log('Accept request:', requestId);
  };

  const handleDecline = (requestId: string) => {
    // In a real app, this would call an API
    console.log('Decline request:', requestId);
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      {/* Header */}
      <div className="border-b border-border-subtle bg-bg-secondary/50 p-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/social/feed"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-text-primary">Friends</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <svg
              className="absolute left-3 top-3 w-5 h-5 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-bg-primary border border-border-subtle px-4 py-2 pl-10 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-border-subtle">
          <button
            onClick={() => setActiveTab('friends')}
            className={`relative pb-3 font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Friends
            <span className="ml-2 inline-block rounded-full bg-accent-gold/20 px-2 py-0.5 text-sm text-accent-gold font-semibold">
              {filteredFriends.length}
            </span>
            {activeTab === 'friends' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-gold rounded-t" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`relative pb-3 font-medium transition-colors ${
              activeTab === 'requests'
                ? 'text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Requests
            <span className="ml-2 inline-block rounded-full bg-accent-green/20 px-2 py-0.5 text-sm text-accent-green font-semibold">
              {filteredRequests.length}
Â÷7ãà¢¶7FfUF"ÓÓÒw&WVW7G2rbb¢ÆFb6Æ74æÖSÒ&'6öÇWFR&÷GFöÒÓÆVgBÓ&vBÓÓ&rÖ66VçBÖvöÆB&÷VæFVB×B"óà¢Ð¢Âö'WGFöãà¢ÂöFcà ¢²ò¢g&VæG2F"6öçFVçB¢÷Ð¢¶7FfUF"ÓÓÒvg&VæG2rbb¢Ãà¢¶fÇFW&VDg&VæG2æÆVæwFâò¢ÆFb6Æ74æÖSÒ'76R×Ó2#à¢¶fÇFW&VDg&VæG2æÖg&VæBÓâ¢ÆF`¢¶W×¶g&VæBæGÐ¢6Æ74æÖSÒ&vÆ72&÷VæFVBÖÆr&÷&FW"&÷&FW"Ö&÷&FW"×7V'FÆR&rÖ&r×6V6öæF'óSÓBfÆWFV×2Ö6VçFW"§W7FgÖ&WGvVVâ÷fW#¦&rÖ&r×6V6öæF'ósG&ç6FöâÖÆÂ ¢à¢ÆFb6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓB#à¢²ò¢fF"¢÷Ð¢ÆFb6Æ74æÖSÒ&fÆWÓ"rÓ"FV×2Ö6VçFW"§W7FgÖ6VçFW"&÷VæFVBÖgVÆÂ&rÖw&FVçB×FòÖ'"g&öÒÖ66VçBÖvöÆBFòÖ66VçBÖw&VVâFWBÖ&r×&Ö'föçBÖ&öÆB#à¢¶g&VæBæfF'Ð¢ÂöFcà ¢²ò¢æfò¢÷Ð¢ÆFcà¢Æ26Æ74æÖSÒ'FWB×FWB×&Ö'föçB×6VÖ&öÆB#à¢¶g&VæBçW6W&æÖWÐ¢Âö3à¢Ç6Æ74æÖSÒ'FWB×FWBÖ×WFVBFWB×6Ò#à¢ÆWfVÂ¶g&VæBçF÷FÄÆWfVÇÐ¢Â÷à¢ÂöFcà¢ÂöFcà ¢²ò¢fWr&öfÆRÆæ²¢÷Ð¢ÄÆæ°¢&Vc×¶÷6ö6Â÷&öfÆRòG¶g&VæBæGÖÐ¢6Æ74æÖSÒ'&÷VæFVBÖÆr&rÖ66VçBÖvöÆBó#ÓBÓ"FWBÖ66VçBÖvöÆBföçBÖÖVFVÒ÷fW#¦&rÖ66VçBÖvöÆBó3G&ç6FöâÖ6öÆ÷'2 ¢à¢fWr&öfÆP¢ÂôÆæ³à¢ÂöFcà¢Ð¢ÂöFcà¢¢¢ÆFb6Æ74æÖSÒ'&÷VæFVBÖÆr&÷&FW"&÷&FW"Ö&÷&FW"×7V'FÆR&rÖ&r×6V6öæF'óSÓ"FWBÖ6VçFW"#à¢Ç6Æ74æÖSÒ'FWB×FWB×6V6öæF'#à¢·6V&6VW'¢òtæòg&VæG2f÷VæBÖF6ær÷W"6V&6âp¢¢u÷RfRæòg&VæG2WBâwÐ¢Â÷à¢ÂöFcà¢Ð¢Âóà¢Ð ¢²ò¢&WVW7G2F"6öçFVçB¢÷Ð¢¶7FfUF"ÓÓÒw&WVW7G2rbb¢Ãà¢¶fÇFW&VE&WVW7G2æÆVæwFâò¢ÆFb6Æ74æÖSÒ'76R×Ó2#à¢¶fÇFW&VE&WVW7G2æÖ&WVW7BÓâ¢ÆF`¢¶W×·&WVW7BæGÐ¢6Æ74æÖSÒ&vÆ72&÷VæFVBÖÆr&÷&FW"&÷&FW"Ö&÷&FW"×7V'FÆR&rÖ&r×6V6öæF'óSÓBfÆWFV×2Ö6VçFW"§W7FgÖ&WGvVVâ÷fW#¦&rÖ&r×6V6öæF'ósG&ç6FöâÖÆÂ ¢à¢ÆFb6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓB#à¢²ò¢fF"¢÷Ð¢ÆFb6Æ74æÖSÒ&fÆWÓ"rÓ"FV×2Ö6VçFW"§W7FgÖ6VçFW"&÷VæFVBÖgVÆÂ&rÖw&FVçB×FòÖ'"g&öÒÖ66VçBÖvöÆBFòÖ66VçBÖw&VVâFWBÖ&r×&Ö'föçBÖ&öÆB#à¢·&WVW7BæfF'Ð¢ÂöFcà ¢²ò¢æfò¢÷Ð¢ÆFcà¢Æ26Æ74æÖSÒ'FWB×FWB×&Ö'föçB×6VÖ&öÆB#à¢·&WVW7BçW6W&æÖWÐ¢Âö3à¢Ç6Æ74æÖSÒ'FWB×FWBÖ×WFVBFWB×6Ò#çvçG2Fò&R÷W"g&VæCÂ÷à¢ÂöFcà¢ÂöFcà ¢²ò¢7Föâ'WGFöç2¢÷Ð¢ÆFb6Æ74æÖSÒ&fÆWvÓ"#à¢Æ'WGFöà¢öä6Æ6³×²ÓâæFÆT66WB&WVW7BæBÐ¢6Æ74æÖSÒ'&÷VæFVBÖÆr&rÖ66VçBÖw&VVâÓBÓ"FWBÖ&r×&Ö'föçBÖÖVFVÒ÷fW#¦&rÖ66VçBÖw&VVâóG&ç6FöâÖ6öÆ÷'2 ¢à¢66W@¢Âö'WGFöãà¢Æ'WGFöà¢öä6Æ6³×²ÓâæFÆTFV6ÆæR&WVW7BæBÐ¢6Æ74æÖSÒ'&÷VæFVBÖÆr&rÖ&r×FW'F'&÷&FW"&÷&FW"Ö&÷&FW"×7V'FÆRÓBÓ"FWB×FWB×6V6öæF'föçBÖÖVFVÒ÷fW#¦&rÖ&r×6V6öæF'G&ç6FöâÖ6öÆ÷'2 ¢à¢FV6ÆæP¢Âö'WGFöãà¢ÂöFcà¢ÂöFcà¢Ð¢ÂöFcà¢¢¢ÆFb6Æ74æÖSÒ'&÷VæFVBÖÆr&÷&FW"&÷&FW"Ö&÷&FW"×7V'FÆR&rÖ&r×6V6öæF'óSÓ"FWBÖ6VçFW"#à¢Ç6Æ74æÖSÒ'FWB×FWB×6V6öæF'#à¢·6V&6VW'¢òtæò&WVW7G2f÷VæBÖF6ær÷W"6V&6âp¢¢u÷RfRæòVæFærg&VæB&WVW7G2âwÐ¢Â÷à¢ÂöFcà¢Ð¢Âóà¢Ð¢ÂöFcà ¢²ò¢fÆöFær7Föâ'WGFöâÒFBg&VæB¢÷Ð¢ÄÆæ°¢&VcÒ"÷6ö6ÂöFBÖg&VæB ¢6Æ74æÖSÒ&fVB&÷GFöÒÓ&vBÓfÆWÓbrÓbFV×2Ö6VçFW"§W7FgÖ6VçFW"&÷VæFVBÖgVÆÂ&rÖw&FVçB×FòÖ'"g&öÒÖ66VçBÖvöÆBFòÖ66VçBÖw&VVâFWBÖ&r×&Ö'föçBÖ&öÆBFWBÓ'Â6F÷rÖÆr÷fW#§6F÷r×Â÷fW#§66ÆRÓG&ç6FöâÖÆÂ ¢FFÆSÒ$FBg&VæB ¢à¢°¢ÂôÆæ³à¢ÂöFcà¢°§Ð