'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/registry/new-york-v4/ui/button'
import { Input } from '@/registry/new-york-v4/ui/input'
import { Textarea } from '@/registry/new-york-v4/ui/textarea'
import { Checkbox } from '@/registry/new-york-v4/ui/checkbox'
import { Switch } from '@/registry/new-york-v4/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/registry/new-york-v4/ui/radio-group'
import { Slider } from '@/registry/new-york-v4/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select'
import { TracedForm, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/registry/new-york-v4/ui/form'
import { Label } from '@/registry/new-york-v4/ui/label'

export default function FormTraceTestPage() {
  const [plan, setPlan] = useState('free')
  const [notifications, setNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [price, setPrice] = useState([50])
  const [country, setCountry] = useState('')

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      bio: '',
    }
  })

  const onSubmit = async (data: any) => {
    console.log('Form submitted:', data)
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Form submitted successfully!')
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Form Components Tracing Test</h1>

      <div className="space-y-12">
        {/* Input Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Input Component</h2>
          <div className="grid gap-4 max-w-md">
            <div className="space-y-2">
              <Label>Regular Input (No Trace)</Label>
              <Input placeholder="Type something..." />
            </div>
            
            <div className="space-y-2">
              <Label>Traced Input (Default Name)</Label>
              <Input 
                trace 
                placeholder="This input is traced"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Email Input (Custom Name + Metadata)</Label>
              <Input 
                type="email"
                trace="email-input"
                traceMetadata={{ field_type: 'email', required: true }}
                placeholder="your@email.com"
              />
            </div>
          </div>
        </section>

        {/* Textarea Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Textarea Component</h2>
          <div className="grid gap-4 max-w-md">
            <div className="space-y-2">
              <Label>Traced Textarea (Tracks Lines)</Label>
              <Textarea 
                trace="feedback-textarea"
                traceMetadata={{ max_length: 500, field: 'feedback' }}
                placeholder="Write your feedback here..."
              />
            </div>
          </div>
        </section>

        {/* Checkbox Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Checkbox Component</h2>
          <div className="grid gap-4 max-w-md">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Regular Checkbox (No Trace)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="notifications"
                trace="notifications-checkbox"
                traceMetadata={{ feature: 'email_notifications' }}
                checked={notifications}
                onCheckedChange={(checked) => setNotifications(checked as boolean)}
              />
              <Label htmlFor="notifications">
                Enable Email Notifications (Traced)
              </Label>
            </div>
          </div>
        </section>

        {/* Switch Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Switch Component</h2>
          <div className="grid gap-4 max-w-md">
            <div className="flex items-center space-x-2">
              <Switch 
                id="dark-mode"
                trace="dark-mode-toggle"
                traceMetadata={{ setting: 'theme', location: 'test_page' }}
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
              <Label htmlFor="dark-mode">Dark Mode (Traced)</Label>
            </div>
          </div>
        </section>

        {/* Radio Group Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Radio Group Component</h2>
          <div className="grid gap-4 max-w-md">
            <Label>Select a plan (Traced)</Label>
            <RadioGroup 
              value={plan}
              onValueChange={setPlan}
              trace="plan-selector"
              traceMetadata={{ section: 'pricing', options_count: 3 }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free">Free ($0/month)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pro" id="pro" />
                <Label htmlFor="pro">Pro ($29/month)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enterprise" id="enterprise" />
                <Label htmlFor="enterprise">Enterprise ($99/month)</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-muted-foreground">Selected: {plan}</p>
          </div>
        </section>

        {/* Slider Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Slider Component</h2>
          <div className="grid gap-4 max-w-md">
            <Label>Price Range (Traced)</Label>
            <Slider 
              min={0}
              max={100}
              step={1}
              value={price}
              onValueChange={setPrice}
              trace="price-slider"
              traceMetadata={{ filter: 'price', currency: 'USD' }}
            />
            <p className="text-sm text-muted-foreground">Value: ${price[0]}</p>
          </div>
        </section>

        {/* Select Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Select Component</h2>
          <div className="grid gap-4 max-w-md">
            <Label>Country (Traced)</Label>
            <Select 
              value={country}
              onValueChange={setCountry}
              trace="country-selector"
              traceMetadata={{ field: 'shipping_country' }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
              </SelectContent>
            </Select>
            {country && (
              <p className="text-sm text-muted-foreground">Selected: {country}</p>
            )}
          </div>
        </section>

        {/* Traced Form Component */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Full Form (Traced)</h2>
          <div className="max-w-md">
            <TracedForm
              {...form}
              trace="signup-form"
              traceMetadata={{ form_type: 'signup', page: 'test' }}
              onSubmit={onSubmit}
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your@email.com" 
                          trace="form-email-field"
                          traceMetadata={{ form: 'signup' }}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        We'll never share your email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          trace="form-password-field"
                          traceMetadata={{ form: 'signup' }}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about yourself..." 
                          trace="form-bio-field"
                          traceMetadata={{ form: 'signup' }}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  trace="form-submit-button"
                  traceMetadata={{ form: 'signup' }}
                >
                  Submit Form
                </Button>
              </div>
            </TracedForm>
          </div>
        </section>
      </div>

      {/* Instructions */}
      <div className="mt-12 p-6 bg-muted rounded-lg space-y-4">
        <h3 className="font-semibold text-lg">🧪 Testing Guide:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Interact with each component above</li>
          <li>Open Jaeger at <a href="http://localhost:16686" target="_blank" className="text-blue-500 underline">http://localhost:16686</a></li>
          <li>Select service: <code className="bg-background px-1 py-0.5 rounded">v4-app-client</code></li>
          <li>Click "Find Traces" to see all interactions</li>
        </ol>

        <div className="pt-4 border-t space-y-2">
          <h4 className="font-semibold">Expected Traces:</h4>
          <div className="bg-background p-4 rounded font-mono text-xs space-y-1">
            <div>✓ email-input.change (with value_length)</div>
            <div>✓ email-input.focus</div>
            <div>✓ email-input.blur (with has_value)</div>
            <div>✓ feedback-textarea.change (with line_count)</div>
            <div>✓ notifications-checkbox.change (with checked state)</div>
            <div>✓ dark-mode-toggle.toggle (with checked state)</div>
            <div>✓ plan-selector.select (with selected value)</div>
            <div>✓ price-slider.change (during drag)</div>
            <div>✓ price-slider.blur (on release, with committed flag)</div>
            <div>✓ country-selector.select (with value)</div>
            <div>✓ country-selector.focus/blur (dropdown open/close)</div>
            <div>✓ signup-form.submit (with field_count, timing)</div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Trace Attributes to Check:</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• <strong>Input:</strong> component.input_type, component.value_length, component.has_value</li>
            <li>• <strong>Textarea:</strong> component.line_count, component.value_length</li>
            <li>• <strong>Checkbox:</strong> component.checked, component.indeterminate</li>
            <li>• <strong>Switch:</strong> component.checked</li>
            <li>• <strong>RadioGroup:</strong> component.value</li>
            <li>• <strong>Slider:</strong> component.value, component.min, component.max, component.committed</li>
            <li>• <strong>Select:</strong> component.value, component.open</li>
            <li>• <strong>Form:</strong> component.field_count, timing information</li>
            <li>• All custom metadata from traceMetadata prop</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
