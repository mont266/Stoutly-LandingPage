import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export enum Platform {
  WEB = 'WEB',
  ANDROID = 'ANDROID',
  IOS = 'IOS'
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}