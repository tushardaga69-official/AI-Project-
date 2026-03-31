'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import {
  Building,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Mail,
  Save,
  Check,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen">
      <AppHeader title="Settings" />

      <div className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="rounded-xl border border-border bg-card p-6">
              {activeTab === 'company' && (
                <div>
                  <h2 className="mb-6 text-lg font-semibold text-card-foreground">
                    Company Information
                  </h2>

                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                          Company Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Acme Corporation"
                          className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                          Industry
                        </label>
                        <select className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                          <option>Retail</option>
                          <option>Manufacturing</option>
                          <option>E-commerce</option>
                          <option>Wholesale</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Business Address
                      </label>
                      <input
                        type="text"
                        defaultValue="123 Business Street, San Francisco, CA 94105"
                        className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                          Phone
                        </label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 123-4567"
                          className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue="contact@acme.com"
                          className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Tax ID / VAT Number
                      </label>
                      <input
                        type="text"
                        defaultValue="US123456789"
                        className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                          Currency
                        </label>
                        <select className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                          <option>USD - US Dollar</option>
                          <option>EUR - Euro</option>
                          <option>GBP - British Pound</option>
                          <option>JPY - Japanese Yen</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                          Timezone
                        </label>
                        <select className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                          <option>America/Los_Angeles (PST)</option>
                          <option>America/New_York (EST)</option>
                          <option>Europe/London (GMT)</option>
                          <option>Asia/Tokyo (JST)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="mb-6 text-lg font-semibold text-card-foreground">
                    Notification Preferences
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">Low Stock Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when products fall below minimum stock
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" defaultChecked className="peer sr-only" />
                        <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-ring after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-foreground after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">Order Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications for new orders and status changes
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" defaultChecked className="peer sr-only" />
                        <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-ring after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-foreground after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">AI Insights</p>
                        <p className="text-sm text-muted-foreground">
                          Daily AI-generated recommendations and forecasts
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" defaultChecked className="peer sr-only" />
                        <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-ring after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-foreground after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive critical alerts via email
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" />
                        <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-ring after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-foreground after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">Weekly Reports</p>
                        <p className="text-sm text-muted-foreground">
                          Receive weekly summary reports
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" defaultChecked className="peer sr-only" />
                        <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-ring after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-foreground after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="mb-6 text-lg font-semibold text-card-foreground">
                    Security Settings
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 font-medium text-foreground">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-foreground">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-foreground">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-foreground">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="mb-4 font-medium text-foreground">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div>
                          <p className="font-medium text-foreground">Enable 2FA</p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <button className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                          Enable
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="mb-4 font-medium text-foreground">Active Sessions</h3>
                      <div className="rounded-lg border border-border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">Current Session</p>
                            <p className="text-sm text-muted-foreground">
                              San Francisco, CA - Chrome on MacOS
                            </p>
                          </div>
                          <span className="rounded-full bg-success/20 px-2 py-1 text-xs font-medium text-success">
                            Active Now
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div>
                  <h2 className="mb-6 text-lg font-semibold text-card-foreground">Appearance</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="mb-3 block text-sm font-medium text-foreground">Theme</label>
                      <div className="grid grid-cols-3 gap-4">
                        <button className="flex flex-col items-center gap-2 rounded-lg border-2 border-primary bg-muted/50 p-4 transition-colors">
                          <div className="h-16 w-full rounded-lg bg-background" />
                          <span className="text-sm font-medium text-foreground">Dark</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/50 p-4 transition-colors hover:border-primary">
                          <div className="h-16 w-full rounded-lg bg-white" />
                          <span className="text-sm font-medium text-foreground">Light</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/50 p-4 transition-colors hover:border-primary">
                          <div className="h-16 w-full rounded-lg bg-gradient-to-b from-white to-background" />
                          <span className="text-sm font-medium text-foreground">System</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Date Format
                      </label>
                      <select className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Number Format
                      </label>
                      <select className="h-10 w-full rounded-lg border border-border bg-input px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                        <option>1,234.56</option>
                        <option>1.234,56</option>
                        <option>1 234.56</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div>
                  <h2 className="mb-6 text-lg font-semibold text-card-foreground">Integrations</h2>

                  <div className="space-y-4">
                    {[
                      { name: 'Shopify', description: 'Sync products and orders', connected: true },
                      { name: 'QuickBooks', description: 'Accounting integration', connected: false },
                      { name: 'Stripe', description: 'Payment processing', connected: true },
                      { name: 'Slack', description: 'Team notifications', connected: false },
                    ].map((integration) => (
                      <div
                        key={integration.name}
                        className="flex items-center justify-between rounded-lg border border-border p-4"
                      >
                        <div>
                          <p className="font-medium text-foreground">{integration.name}</p>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                        {integration.connected ? (
                          <span className="rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-success">
                            Connected
                          </span>
                        ) : (
                          <button className="h-9 rounded-lg border border-border bg-secondary px-4 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                            Connect
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div>
                  <h2 className="mb-6 text-lg font-semibold text-card-foreground">
                    Billing & Subscription
                  </h2>

                  <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">Professional Plan</p>
                        <p className="text-sm text-muted-foreground">$49/month - Billed monthly</p>
                      </div>
                      <span className="rounded-full bg-success/20 px-3 py-1 text-xs font-medium text-success">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">Next Billing Date</p>
                        <p className="text-sm text-muted-foreground">April 27, 2026</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">Payment Method</p>
                        <p className="text-sm text-muted-foreground">Visa ending in 4242</p>
                      </div>
                      <button className="text-sm font-medium text-primary hover:underline">
                        Update
                      </button>
                    </div>

                    <button className="h-10 w-full rounded-lg border border-primary bg-transparent text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                      Upgrade Plan
                    </button>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {saved ? (
                    <>
                      <Check className="h-4 w-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
