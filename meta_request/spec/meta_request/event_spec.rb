# frozen_string_literal: true

require 'spec_helper'

RSpec.describe MetaRequest::Event do
  describe '.new' do
    context 'when transforming an event from ActiveSupport::Cache' do
      let(:active_support_cache_events) do
        %w[
          cache_read.active_support
          cache_write.active_support
        ]
      end

      let(:payload) do
        {
          key: [
            'views',
            'users/show:118c2da025706846afc6874e76b33a5c',
            active_record_relation
          ]
        }
      end

      let(:active_record_relation) do
        double('ActiveRecord::Relation', cache_key: 'users/query-e06f359ccb226f3021b50c0c7e457f79')
      end

      let(:full_cache_key) do
        'views/users/show:118c2da025706846afc6874e76b33a5c/users/query-e06f359ccb226f3021b50c0c7e457f79'
      end

      it 'replaces the cache key with its String representation and does not trigger SQL queries' do
        # This would result in an SQL query being executed
        expect(active_record_relation).to_not receive(:as_json)

        event = described_class.new(
          active_support_cache_events.sample,
          Time.parse('2023-08-02 23:10:00.759479575 +0200'),
          Time.parse('2023-08-02 23:10:00.761230028 +0200'),
          SecureRandom.hex(10),
          payload
        )

        expect(event.payload[:key]).to eq(full_cache_key)
      end
    end
  end
end
