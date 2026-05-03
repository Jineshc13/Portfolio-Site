
import React from 'react';
import { Shield, Lock, Terminal, Award, BookOpen, User, Film, Mail, Linkedin, Github, Cpu, Activity, Eye, Zap, Database, Server, Search, Globe, Fingerprint, Bug, Radar, Binary, Waypoints } from 'lucide-react';
import { ExperienceItem, SkillCategory, Achievement } from './types';

export const PERSONAL_INFO = {
  name: "JINESH CHUDASAMA",
  title: "SECURITY INTELLIGENCE COMMANDER",
  tagline: "Vulnerability Architect. Threat Hunter. Strategic Performer.",
  location: "MUMBAI OPS // GLOBAL AVAILABILITY",
  email: "jineshc13.work@gmail.com",
  phone: "+91 91362-86744",
  linkedin: "https://linkedin.com/in/Jinesh-chudasama",
  github: "https://github.com/JineshC13",
};

export const MISSIONS: ExperienceItem[] = [
  {
    role: "Senior Security Operative",
    company: "Bandhan AMC",
    location: "Mainframe Base",
    period: "JUN 2024 - ACTIVE",
    highlights: [
      "DARK WEB SURVEILLANCE: Discovered and neutralized 1,000+ deep web threats utilizing CloudSEK intelligence.",
      "OFFENSIVE VAPT MANEUVERS: Orchestrated full-stack penetration testing on critical fintech infrastructure, securing $B+ in assets.",
      "ADVERSARY SIMULATION: Spearheaded Breach & Attack Simulations (BAS) via Cymulate to stress-test real-time defensive toolkits.",
      "CLOUD DEFENSE ENFORCEMENT: Architected GCP Cloud Armor policies and VPC guardrails for zero-trust compliance.",
      "CRYPTO-GUARD PROTOCOLS: Implemented enterprise-wide DMARC/SPF/DKIM hardening to eliminate mail-borne phishing vectors.",
      "REGULATORY COMPLIANCE: Mapped threat models to SEBI standards, ensuring 100% uptime and regulatory alignment."
    ]
  }
];

export const ARSENAL = [
  {
    category: "Offensive Ops",
    icon: <Bug size={24} className="text-[#ff003c]" />,
    skills: [
      { name: "Burp Suite Pro", level: 95, detail: "Mastery in proxying and manual exploitation" },
      { name: "Nessus", level: 92, detail: "Enterprise-grade vulnerability scanning" },
      { name: "Nmap Scripting", level: 98, detail: "Advanced network recon & NSE scripting" },
      { name: "OWASP ZAP", level: 88, detail: "Automated DAST and security crawling" }
    ]
  },
  {
    category: "Defensive Grid",
    icon: <Shield size={24} className="text-[#00ff41]" />,
    skills: [
      { name: "GCP Cloud Armor", level: 90, detail: "WAF & DDoS mitigation strategies" },
      { name: "SentinelOne", level: 85, detail: "EDR monitoring and incident response" },
      { name: "CIS Hardening", level: 94, detail: "OS & Application hardening standards" },
      { name: "DMARC/Email Sec", level: 96, detail: "Advanced cryptographic mail signing" }
    ]
  },
  {
    category: "Intelligence",
    icon: <Radar size={24} className="text-[#00a2ff]" />,
    skills: [
      { name: "CloudSEK", level: 92, detail: "Dark web & Brand threat monitoring" },
      { name: "Threat Modeling", level: 88, detail: "STRIDE/PASTA framework application" },
      { name: "Cymulate BAS", level: 82, detail: "Breach & attack simulation logic" },
      { name: "AD Security", level: 80, detail: "Active Directory exploitation & defense" }
    ]
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    title: "BANDHAN AMC STAR AWARD",
    description: "Exceptional performance recognition for Q1 2025. Maintained zero-breach status during high-intensity threat cycles."
  },
  {
    title: "ELITE BUG BOUNTY RESEARCHER",
    description: "Documented vulnerabilities in Top 500 Enterprise systems. Recognized by security teams globally for precise disclosures."
  }
];

export const NAV_LINKS = [
  { name: 'IDENTITY', href: '#identity', icon: <Fingerprint size={18} /> },
  { name: 'MISSIONS', href: '#missions', icon: <Binary size={18} /> },
  { name: 'ARSENAL', href: '#arsenal', icon: <Terminal size={18} /> },
  { name: 'BASE', href: '#base', icon: <Server size={18} /> },
  { name: 'COMMUNICATION', href: '#comms', icon: <Mail size={18} /> },
];

export const SOCIAL_LINKS = [
  { name: 'LINKEDIN', icon: <Linkedin size={20} />, url: PERSONAL_INFO.linkedin },
  { name: 'GITHUB', icon: <Github size={20} />, url: PERSONAL_INFO.github },
];
