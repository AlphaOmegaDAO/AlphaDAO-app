<template>
  <div class="container-fluid mt-4">
    <div class="row mt-4">
      <div class="col-sm-4 mb-2 mb-sm-0">
        <div class="card ohm-dashboard-card">
          <div class="card-body">
            <h4 class="card-title">
              Price (SushiSwap OHM-DAI Pool)
              <a
                href="https://analytics.sushi.com/pairs/0x34d7d7aaf50ad4944b70b320acb24c95fa2def7c"
                target="_blank"
              >
                <i class="fas fa-external-link-alt fa-sm ml-1"></i>
              </a>
            </h4>
            <div class="my-auto">
              <h1 class="text-center">
                {{
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 2
                  }).format($store.state.analytics.marketPrice)
                }}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-4 mb-2 mb-sm-0">
        <div class="card ohm-dashboard-card">
          <div class="card-body">
            <h4 class="card-title">Market Cap</h4>
            <h1 class="text-center">
              {{
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(getMarketCap())
              }}
            </h1>
          </div>
        </div>
      </div>

      <div class="col-sm-4 mb-2 mb-sm-0">
        <div class="card ohm-dashboard-card">
          <div class="card-body">
            <h4 class="card-title">
              Supply (circulating/total)
            </h4>
            <h1 class="text-center">
              {{
                new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
                  $store.state.analytics.ohmCircSupply / Math.pow(10,9)
                )
              }}
              /
              {{
                new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
                  $store.state.analytics.ohmTotalSupply / Math.pow(10,9)
                )
              }}
            </h1>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-sm-6 mb-2 mb-sm-0">
        <div class="card olympus-card">
          <div class="card-body">
            <iframe
              frameborder="0"
              src="https://duneanalytics.com/embeds/28286/57140/b0e3c522-8ace-47e8-8ac9-bc4ebf10b8c7"
              title="Total Value Staking"
              style="height:400px;"
            ></iframe>
          </div>
        </div>
      </div>

      <div class="col-sm-6 mb-2 mb-sm-0">
        <div class="card olympus-card">
          <div class="card-body">
            <iframe
              frameborder="0"
              src="https://duneanalytics.com/embeds/29778/60051/6328b87b-183e-4456-888d-d91048ff8cff"
              title="Market value of Treasury"
              style="height:400px;"
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-sm-6 mb-2 mb-sm-0">
        <div class="card olympus-card">
          <div class="card-body">
            <iframe
              frameborder="0"
              src="https://duneanalytics.com/embeds/29153/58862/b6d18145-763a-48b6-ac4c-a8e43ec1c1f6"
              title="Risk Free Value of Treasury"
              style="height:400px;"
            ></iframe>
          </div>
        </div>
      </div>

      <div class="col-sm-6 mb-2 mb-sm-0">
        <div class="card olympus-card">
          <div class="card-body">
            <iframe
              frameborder="0"
              src="https://duneanalytics.com/embeds/29815/60140/0be45969-dfc2-4625-9b48-d7af19a45546"
              title="Total Value Staking"
              style="height:400px;"
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4 mb-4">
      <div class="col-sm-6 mb-2 mb-sm-0">
        <div class="card olympus-card">
          <div class="card-body">
            <iframe
              frameborder="0"
              src="https://duneanalytics.com/embeds/27661/55859/fd0e3db2-d033-4000-9f70-c65de52ef9a9"
              title="Holders"
              style="height:400px;"
            ></iframe>
          </div>
        </div>
      </div>
      <div class="col-sm-6 mb-2 mb-sm-0">
        <div class="card olympus-card">
          <div class="card-body">
            <iframe
              frameborder="0"
              src="https://duneanalytics.com/embeds/34202/69216/17e353f6-ccb4-42ff-b6cb-150f69543f4d"
              title="APY Over Time"
              style="height:400px;"
            ></iframe>
          </div>
        </div>
      </div>
    </div>



    <div class="row mt-4 mb-4">
      <div class="col-sm-6 mb-2 mb-sm-0">
        <div class="card olympus-card">
          <div class="card-body">
            <iframe
              frameborder="0"
              src="https://duneanalytics.com/embeds/28756/58813/c7893c75-d8f1-421e-85c3-556a22cd7885"
              title="OHM Stakers"
              style="height:400px;"
            ></iframe>
          </div>
        </div>
      </div>
      <div class="col-sm-6 mb-2 mb-sm-0">
        <div class="card olympus-card">
          <div class="card-body">
            <iframe
              frameborder="0"
              src="https://duneanalytics.com/embeds/37326/74014/f0ad674a-2787-4314-b534-86dc1b910922"
              title="Runway Available"
              style="height:400px;"
            ></iframe>
          </div>
        </div>
      </div>
    </div>



  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(['analytics'])
  },
  methods: {
    getMarketCap() {
      return (
        this.$store.state.analytics.marketPrice * (this.$store.state.analytics.ohmCircSupply / Math.pow(10, 9))
      );
    },

    formatCurrency(value) {
      return this.formatCurrency(value);
    }
  },
};
</script>
